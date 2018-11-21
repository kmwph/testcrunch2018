import Vue from 'vue';
import Vuex from 'vuex';
import todoApi from './services/todoApi';
import { todoFilters } from './constants';

export const todoMutations = {
  set: 'TODO_SET',
  add: 'TODO_ADD',
  update: 'TODO_UPDATE',
  delete: 'TODO_DELETE',
  setFilter: 'TODO_SET_FILTER',
  setModelState: 'TODO_SET_MODEL_STATE',
  setItemModelState: 'TODO_SET_ITEM_MODEL_STATE',
};

export const modelStates = {
  init: 'init',
  loading: 'loading',
  loaded: 'loaded',
  processing: 'processing',
  error: 'error',
};

function removeInternalState(data) {
  const copy = { ...data };
  Object.keys(copy)
    .filter(i => i.startsWith('__'))
    .forEach(i => delete copy[i]);

  return copy;
}

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state: {
    all: [],
    filter: undefined,
    modelState: modelStates.init,
  },

  getters: {
    loading(s) {
      return s.modelState === modelStates.loading;
    },
    loaded(s) {
      return s.modelState === modelStates.loaded;
    },
    error(s) {
      return s.modelState === modelStates.error;
    },
    itemIsProcessing(s) {
      return s.all.some(i => i.__state === modelStates.processing);
    },
    active(s) {
      return s.all.filter(i => !i.finished);
    },
    completed(s) {
      return s.all.filter(i => i.finished);
    },
    filtered(s, g) {
      switch (s.filter) {
        case todoFilters.active:
          return g.active;
        case todoFilters.completed:
          return g.completed;
        default:
          return s.all;
      }
    },
  },

  mutations: {
    [todoMutations.set](s, todos) {
      s.all = [...todos];
      s.modelState = modelStates.loaded;
    },
    [todoMutations.add](s, todos) {
      s.all = s.all.concat(todos);
    },
    [todoMutations.update](s, { id, newData, state = modelStates.loaded }) {
      const foundIndex = s.all.findIndex(i => i.id === id);
      if (foundIndex < 0) {
        throw new Error(`Todo [${id}] was not found in store for update`);
      }

      Vue.set(newData, '__state', state);
      s.all.splice(foundIndex, 1, newData);
    },
    [todoMutations.delete](s, id) {
      const foundIndex = s.all.findIndex(i => i.id === id);
      if (foundIndex < 0) {
        throw new Error(`Todo [${id}] was not found in store for delete`);
      }

      s.all.splice(foundIndex, 1);
    },
    [todoMutations.setFilter](s, filter) {
      s.filter = filter;
    },
    [todoMutations.setModelState](s, state) {
      s.modelState = state;
    },
    [todoMutations.setItemModelState](s, {
      id,
      state,
      retry,
      reverse,
    }) {
      const todo = s.all.find(i => i.id === id);
      if (!todo) {
        throw new Error(`Todo [${id}] was not found in store for update internal state`);
      }

      Vue.set(todo, '__state', state);
      Vue.set(todo, '__retry', retry);
      Vue.set(todo, '__reverse', reverse);
    },
  },

  actions: {
    async fetchAll({ commit }) {
      try {
        commit(todoMutations.setModelState, modelStates.loading);
        const todos = await todoApi.getAll();
        commit(todoMutations.set, todos);
      } catch (e) {
        console.error(e);
        commit(todoMutations.setModelState, modelStates.error);
        throw new Error('Error during fetch todos');
      }
    },
    async patch({ state, commit, dispatch }, { id, data }) {
      const foundTodo = state.all.find(i => i.id === id);
      if (!foundTodo) {
        throw new Error(`Todo [${id}] was not found in store for patch`);
      }

      const updatedData = { ...foundTodo, ...data };

      try {
        commit(todoMutations.update, { id, state: modelStates.processing, newData: updatedData });
        await todoApi.patch(id, removeInternalState(data));
        commit(todoMutations.setItemModelState, { id, state: modelStates.loaded });
      } catch (e) {
        const reverse = foundTodo.__reverse
          || (() => commit(todoMutations.update, { id, newData: { ...foundTodo } }));
        commit(todoMutations.setItemModelState, {
          id,
          state: modelStates.error,
          retry: () => dispatch('patch', { id, data }),
          reverse,
        });
        console.error(e);
        throw new Error('Error during patch todo');
      }
    },
    async create({ commit, dispatch }, todo) {
      const temporaryTodo = {
        ...todo,
        id: Math.random().toString(36).substr(2, 16),
        __state: modelStates.processing,
      };

      try {
        commit(todoMutations.add, temporaryTodo);
        const createdTodo = await todoApi.create(removeInternalState(todo));
        createdTodo.__temporaryId = temporaryTodo.id;
        commit(todoMutations.update, { id: temporaryTodo.id, newData: createdTodo });
      } catch (e) {
        const retry = temporaryTodo.__retry
        || (() => dispatch('recreate', temporaryTodo));
        commit(todoMutations.setItemModelState, {
          id: temporaryTodo.id,
          state: modelStates.error,
          retry,
          reverse: () => commit(todoMutations.delete, temporaryTodo.id),
        });
        console.error(e);
        throw new Error('Error during create todo');
      }
    },
    async delete({ commit, dispatch }, id) {
      try {
        commit(todoMutations.setItemModelState, { id, state: modelStates.processing });
        await todoApi.delete(id);
        commit(todoMutations.delete, id);
      } catch (e) {
        commit(todoMutations.setItemModelState, {
          id,
          state: modelStates.error,
          retry: () => dispatch('delete', id),
          reverse: () => commit(todoMutations.setItemModelState, { id, state: modelStates.loaded }),
        });
        console.error(e);
        throw new Error('Error during delete todo');
      }
    },
    async deleteCompleted({ getters, dispatch }) {
      try {
        const deleteIds = getters.completed.map(i => i.id);
        const promises = deleteIds.map(i => dispatch('delete', i));
        await Promise.all(promises);
      } catch (e) {
        console.error(e);
        throw new Error('Error during delete completed todos');
      }
    },
    async recreate({ state, commit }, todo) {
      const foundTodo = state.all.find(i => i.id === todo.id);
      if (!foundTodo) {
        throw new Error(`Todo [${todo.id}] was not found in store for re-create`);
      }

      try {
        commit(todoMutations.setItemModelState, { id: todo.id, state: modelStates.processing });
        const createdTodo = await todoApi.create(removeInternalState(todo));
        createdTodo.__temporaryId = todo.id;
        commit(todoMutations.update, { id: todo.id, newData: createdTodo });
      } catch (e) {
        commit(todoMutations.setItemModelState, { id: todo.id, state: modelStates.error });
        console.error(e);
        throw new Error('Error during re-create todo');
      }
    },
    async retry({ state }, id) {
      const foundTodo = state.all.find(i => i.id === id);
      if (!foundTodo) {
        throw new Error(`Todo [${id}] was not found in store for retry action`);
      }

      if (!foundTodo.__retry) {
        throw new Error(`Todo [${id}] does not contains retry mechanism`);
      }

      return foundTodo.__retry();
    },
    async reverse({ state }, id) {
      const foundTodo = state.all.find(i => i.id === id);
      if (!foundTodo) {
        throw new Error(`Todo [${id}] was not found in store for reverse action`);
      }

      if (!foundTodo.__reverse) {
        throw new Error(`Todo [${id}] does not contains reverse mechanism`);
      }

      return foundTodo.__reverse();
    },
  },
});

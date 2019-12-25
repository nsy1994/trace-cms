import * as reportService from '@/services/report';

export default {
  namespace: 'report',

  state: {
    data: [],
    categoryData: [],
  },

  effects: {
    *queryData({ payload }, { call, put }) {
      const rsp = yield call(reportService.queryData, payload);
      yield put({
        type: 'saveData',
        payload: rsp,
      });
    },
    *queryCategory({ payload }, { call, put }) {
      const rsp = yield call(reportService.queryCategory, payload);
      yield put({
        type: 'saveCategory',
        payload: rsp,
      });
    },
    *addOne({ payload }, { call, put }) {
      const rsp = yield call(reportService.addData, payload);
      yield put({
        type: 'saveData',
        payload: rsp,
      });
    },

    *updateOne({ payload }, { call, put }) {
      const rsp = yield call(reportService.updateData, payload);
      yield put({
        type: 'saveData',
        payload: rsp,
      });
    },

    *delete({ payload }, { call, put }) {
      const rsp = yield call(reportService.deleteData, payload);
      yield put({
        type: 'saveData',
        payload: rsp,
      });
    },
  },

  reducers: {
    saveData(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveCategory(state, action) {
      return {
        ...state,
        categoryData: action.payload,
      };
    },
  },
};

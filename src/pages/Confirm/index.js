import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Divider, Input, Modal, Upload, Button, Icon } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
class CreateForm extends PureComponent {
  render() {
    const { modalVisible, current = {}, form, handleModalVisible } = this.props;
    const width = 600;
    let fileList = [];

    const handleClick = () => {
      handleModalVisible();
    };

    if (current.filePath) {
      fileList = [
        {
          uid: '-1',
          name: current.filePath,
          status: 'done',
          url: `/api/report/download/${current.filePath}`,
        },
      ];
    }

    return (
      <Modal
        width={width}
        destroyOnClose
        title="查看检验报告"
        visible={modalVisible}
        okText="确定"
        onOk={handleClick}
        onCancel={handleClick}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="报告编号">
          {form.getFieldDecorator('number', {
            initialValue: current.number,
          })(<Input disabled="true" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="产品名称">
          {form.getFieldDecorator('name', {
            initialValue: current.name,
          })(<Input disabled="true" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="受检单位">
          {form.getFieldDecorator('sjCompany', {
            initialValue: current.sjCompany,
          })(<Input disabled="true" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="委托单位">
          {form.getFieldDecorator('wtCompany', {
            initialValue: current.wtCompany,
          })(<Input disabled="true" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="检验类别">
          {form.getFieldDecorator('kind', {
            initialValue: current.kind,
          })(<Input disabled="true" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="检验报告">
          {form.getFieldDecorator('filePath', {
            initialValue: current.filePath,
          })(
            <Upload
              action="/api/cms/report/upload"
              defaultFileList={fileList}
              beforeUpload={this.beforeUploadFile}
              onChange={this.handelUploadFile}
              disabled="true"
            >
              {fileList.length >= 1 ? null : (
                <Button>
                  <Icon type="upload" />
                  选择文件
                </Button>
              )}
            </Upload>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="创建节点">
          {form.getFieldDecorator('creator', {
            initialValue: current.creator,
          })(<Input disabled="true" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="创建时间">
          {form.getFieldDecorator('timestamp', {
            initialValue: moment(current.timestamp).format('YYYY-MM-DD HH:mm:ss'),
          })(<Input disabled="true" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="确认节点">
          {form.getFieldDecorator('confirm', {
            initialValue: current.confirm,
          })(<Input disabled="true" />)}
        </FormItem>
      </Modal>
    );
  }
}

@connect(({ confirm, loading }) => ({
  confirm,
  loading: loading.models.confirm,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    current: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'confirm/queryData',
    });
    dispatch({
      type: 'confirm/queryInfo',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, form } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    form.validateFields((err, fieldsValue) => {
      dispatch({
        type: 'confirm/queryData',
        payload: {
          ...params,
          ...fieldsValue,
        },
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      current: undefined,
    });
  };

  confirmReport = (timestamp, nodeId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'confirm/confirmOne',
      payload: {
        timestamp,
        nodeId,
      },
    });
  };

  showEditModal = Item => {
    this.setState({
      modalVisible: true,
      current: Item,
    });
  };

  handleConfirm = (Item, nodeId) => {
    Modal.confirm({
      title: '确认检验报告',
      content: '要确认该检验报告吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.confirmReport(Item.timestamp, nodeId),
    });
  };

  render() {
    const {
      confirm: { data, info },
      loading,
    } = this.props;

    let id = '';
    if (info) {
      id = info.nodeId;
    }
    const { selectedRows, modalVisible, current = {} } = this.state;

    const parentMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };

    const columns = [
      {
        title: '编号',
        dataIndex: 'number',
        sorter: (a, b) => a.number - b.number,
      },
      {
        title: '产品名称',
        dataIndex: 'name',
      },
      {
        title: '受检单位',
        dataIndex: 'sjCompany',
      },
      {
        title: '委托单位',
        dataIndex: 'wtCompany',
      },
      {
        title: '创建人',
        dataIndex: 'creator',
      },
      {
        title: '创建时间',
        dataIndex: 'timestamp',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '确认数',
        dataIndex: 'confirm',
        render: val => <span>{val.length}</span>,
      },
      {
        title: '操作',
        render: (text, Item) => (
          <Fragment>
            <a onClick={() => this.showEditModal(Item)}>查看</a>
            <Divider type="vertical" />
            {Item.confirm.includes(id) ? (
              <span>已确认</span>
            ) : (
              <a onClick={() => this.handleConfirm(Item, id)}>确认</a>
            )}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="确认报告">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} current={current} />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;

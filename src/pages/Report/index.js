import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  Modal,
  message,
  Divider,
  Upload,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
class CreateForm extends PureComponent {
  state = {
    fileList: [],
    fileChange: 0,
    fileTypeValid: true,
    fileSizeValid: true,
  };

  // 文件上传前验证
  beforeUploadFile = file => {
    const isPDF = file.type === 'application/pdf';
    if (!isPDF) {
      message.error('上传的附件只能为pdf格式!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('上传的文件不能大于2M!');
    }
    this.setState({
      // fileTypeValid: !isPDF ? 0 : true,
      fileSizeValid: isLt2M,
    });
  };

  handelUploadFile = ({ fileList }) => {
    const { fileTypeValid, fileSizeValid } = this.state;
    if (fileTypeValid && fileSizeValid) {
      this.setState({
        fileList,
        fileChange: 1,
      });
    }
  };

  render() {
    const { modalVisible, current = {}, form, handleSubmit, handleModalVisible } = this.props;
    let { fileList } = this.state;

    const { fileChange } = this.state;
    const width = 600;
    let isCurrent = false;
    if (JSON.stringify(current) !== '{}') {
      isCurrent = true;
    }

    if (current.filePath && fileChange === 0) {
      fileList = [
        {
          uid: '-1',
          name: current.filePath,
          status: 'done',
          url: `/api/report/download/${current.filePath}`,
        },
      ];
    }

    const okHandle = () => {
      const { fileTypeValid, fileSizeValid } = this.state;
      if (!fileTypeValid) {
        message.error('上传的附件只能为pdf格式!');
        return;
      }
      if (!fileSizeValid) {
        message.error('上传的文件不能大于2M!');
        return;
      }
      form.validateFields((err, fieldsValue) => {
        if (err) return;

        if (fileChange === 1) {
          if (fieldsValue.filePath.file.uid === '-1') {
            fieldsValue.filePath = fieldsValue.file.file.name;
          } else {
            fieldsValue.filePath = fieldsValue.filePath.file.response.message;
          }
        }

        form.resetFields();
        this.setState({
          fileList: [],
          fileChange: 0,
          fileTypeValid: true,
          fileSizeValid: true,
        });
        handleSubmit(fieldsValue);
      });
    };

    const cancelHandel = () => {
      this.setState({
        fileList: [],
        fileChange: 0,
        fileTypeValid: true,
        fileSizeValid: true,
      });
      handleModalVisible();
    };

    const extendsFields = [];
    if (isCurrent) {
      extendsFields.push(
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="创建节点">
          {form.getFieldDecorator('creator', {
            initialValue: current.creator,
          })(<Input disabled="true" />)}
        </FormItem>,
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="创建时间">
          {form.getFieldDecorator('timestamp', {
            initialValue: moment(current.timestamp).format('YYYY-MM-DD HH:mm:ss'),
          })(<Input disabled="true" />)}
        </FormItem>,
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="确认节点">
          {form.getFieldDecorator('confirm', {
            initialValue: current.confirm,
          })(<Input disabled="true" />)}
        </FormItem>,
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="所在区块">
          {form.getFieldDecorator('block', {
            initialValue: current.block,
          })(<Input disabled="true" />)}
        </FormItem>
      );
    }

    return (
      <Modal
        width={width}
        destroyOnClose
        title={`${isCurrent ? '查看' : '新增'}检验报告`}
        visible={modalVisible}
        okText={isCurrent ? '确定' : '保存'}
        onOk={isCurrent ? cancelHandel : okHandle}
        onCancel={cancelHandel}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="报告编号">
          {form.getFieldDecorator('number', {
            initialValue: current.number,
            rules: [{ required: true, message: '报告编号不能为空！' }],
          })(<Input placeholder="请输入报告编号" disabled={isCurrent} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="产品名称">
          {form.getFieldDecorator('name', {
            initialValue: current.name,
            rules: [{ required: true, message: '产品名称不能为空！' }],
          })(<Input placeholder="请输入产品名称" disabled={isCurrent} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="受检单位">
          {form.getFieldDecorator('sjCompany', {
            initialValue: current.sjCompany,
            rules: [{ required: true, message: '受检单位不能为空！' }],
          })(<Input placeholder="请输入受检单位" disabled={isCurrent} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="委托单位">
          {form.getFieldDecorator('wtCompany', {
            initialValue: current.wtCompany,
            rules: [{ required: true, message: '请选择委托单位！' }],
          })(
            <Select placeholder="请选择委托单位" style={{ width: '100%' }} disabled={isCurrent}>
              <Option value="湖北省质量技术监督局">湖北省质量技术监督局</Option>
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="检验类别">
          {form.getFieldDecorator('kind', {
            initialValue: current.kind,
            rules: [{ required: true, message: '请选择检验类别！' }],
          })(
            <Select placeholder="请选择检验类别" style={{ width: '100%' }} disabled={isCurrent}>
              <Option value="省级监督抽查">省级监督抽查</Option>
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="检验报告">
          {form.getFieldDecorator('filePath', {
            initialValue: current.filePath,
            rules: [{ required: true, message: '请选择检验报告！' }],
          })(
            <Upload
              action="/api/report/upload"
              defaultFileList={fileList}
              beforeUpload={this.beforeUploadFile}
              onChange={this.handelUploadFile}
              disabled={isCurrent}
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
        {extendsFields}
      </Modal>
    );
  }
}

@connect(({ report, loading }) => ({
  report,
  loading: loading.models.report,
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
      type: 'report/queryData',
    });
    // dispatch({
    //   type: 'report/queryCategory',
    //   payload: {
    //     category: 'true',
    //   },
    // });
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
        type: 'report/queryData',
        payload: {
          ...params,
          ...fieldsValue,
        },
      });
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'report/delete',
          payload: {
            id: selectedRows.map(row => row.articleId).join(','),
          },
        });
        break;
      default:
        break;
    }
    this.setState({
      selectedRows: [],
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      current: undefined,
    });
  };

  handleSubmit = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/addOne',
      payload: {
        ...fields,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  showEditModal = Item => {
    this.setState({
      modalVisible: true,
      current: Item,
    });
  };

  handleSearch = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'report/queryData',
        payload: {
          ...fieldsValue,
        },
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    form.validateFields(err => {
      if (err) {
        return;
      }
      dispatch({
        type: 'report/queryData',
      });
    });
  };

  renderForm = () => {
    const { form } = this.props;

    return (
      <Form layout="inline" style={{ marginBottom: '20px' }}>
        <FormItem label="报告编号" style={{ marginRight: '30px' }}>
          {form.getFieldDecorator('searchNumber')(
            <Input placeholder="请输入关键词" style={{ width: '300px' }} />
          )}
        </FormItem>
        <FormItem label="产品名称" style={{ marginRight: '30px' }}>
          {form.getFieldDecorator('searchName')(
            <Input placeholder="请输入关键词" style={{ width: '300px' }} />
          )}
        </FormItem>
        <FormItem style={{ marginLeft: '60px' }}>
          <Button type="primary" onClick={this.handleSearch}>
            查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
            重置
          </Button>
        </FormItem>
      </Form>
    );
  };

  render() {
    const {
      report: { data },
      loading,
    } = this.props;

    const { selectedRows, modalVisible, current = {} } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

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
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.showEditModal(record)}>查看</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="检验报告">
        <Card bordered={false}>
          <div>{this.renderForm()}</div>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
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

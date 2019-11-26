import React, { Component } from "react";
import { Form, Upload, Icon, Message, Input, Button } from "antd";
import "./ct.less";
import axios from 'axios'
class CT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: "",
      uploading: false,
      fileList: [],
      imgBeforeUrl: "",
      imgAfterUrl: "",
      id: undefined
    };
  }

  handleUpload = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
          formData.append("file", file);
        });
        this.setState({
          uploading: true
        });
        formData.append("doctorNum", Number(values.doctorNum));
        formData.append("patientNum", Number(values.patientNum));
        // 上传图片接口
        fetch("http://10.16.98.192:3306/api/run/image", {
          method: "POST",
          body: formData
        })
          .then(res => res.json())
          .catch(err => console.log(err))
          .then(id => {
            console.log(id, "id"); // 43
            Message.success("图片上传成功！");
            this.setState({
              id
            });
            // 获取原图片链接
            let urlBefore = `http://10.16.98.192:3306/api/run/image/${Number(
              values.doctorNum
            )}/${Number(values.patientNum)}/url`;
            fetch(urlBefore, { method: "GET" })
              .then(res => res.json())
              .then(res => {
                if (res.length > 0) {
                  this.setState(
                    {
                      imgBeforeUrl: res[0]
                    },
                    () => {
                      console.log(this.state);
                    }
                  );
                }
              });
          });
      }
    });
  };

  handleRun = () => {
    // 模型运行
    const { id } = this.state;
    if (id) {
      let url = `http://10.16.98.192:3306/api/run/image/${id}/run`;
      fetch(url, {
        method: "POST"
      })
        .then(res => res.json())
        .then(res => {
          console.log(res);
          Message.success("模型运行成功！");
          // 获取处理后的链接
          let urlAfter = `http://10.16.98.192:3306/api/run/image/${id}/url`;
          axios.get(urlAfter).then(res=>{
            this.setState({
              imgAfterUrl: res.data
            })
          })
        });
    } else {
      Message.error("没有id, 模型运行失败！");
    }
  };
  handleSearch = () => {
    // 历史结果查询
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let param = {
          doctorNum: Number(values.doctorNum),
          patientNum: Number(values.patientNum)
        };
        let url = `http://10.16.98.192:3306/api/run/image/${param.doctorNum}/${param.patientNum}/url`;
        let urlResult = `http://10.16.98.192:3306/api/run/image/${param.doctorNum}/${param.patientNum}/result/url`;
        fetch(url, {
          method: "GET"
        })
          .then(res => res.json())
          .then(res => {
            if (res.length > 0)
              this.setState({
                imgBeforeUrl: res[0]
              });
          });
        fetch(urlResult, {
          method: "GET"
        })
          .then(res => res.json())
          .then(res => {
            if (res.length > 0)
              this.setState({
                imgAfterUrl: res[0]
              });
          });
      }
    });
  };

  onRemove = file => {
    this.setState(state => {
      const index = state.fileList.indexOf(file);
      const newFileList = state.fileList.slice();
      newFileList.splice(index, 1);
      return {
        fileList: newFileList
      };
    });
  };
  beforeUpload = file => {
    this.setState(state => ({
      fileList: [...state.fileList, file]
    }));
    return false;
  };

  render() {
    console.log(this.state, "this.state");
    const { getFieldDecorator } = this.props.form;
    const { imageUrl } = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "plus"} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className="main-content">
        <div className="wrapper">
          <div className="left">
            <Form layout="inline">
              <Form.Item>
                {getFieldDecorator("doctorNum", {
                  rules: [{ required: true, message: "请输入医生ID" }]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="请输入医生ID"
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("patientNum", {
                  rules: [{ required: true, message: "请输入病患ID" }]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="请输入病患ID"
                  />
                )}
              </Form.Item>
            </Form>
            <Upload
              listType="picture-card"
              beforeUpload={this.beforeUpload}
              onRemove={this.onRemove}
              style={{ marginTop: "20px" }}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
            </Upload>
            <Button
              style={{ width: "150px" }}
              type="primary"
              onClick={this.handleUpload}
            >
              点击上传肝脏CT图片
            </Button>
            <Button
              style={{ width: "150px", display: "block", marginTop: "20px" }}
              type="primary"
              onClick={this.handleRun}
            >
              模型运行
            </Button>
            <Button
              style={{ width: "150px", display: "block", marginTop: "20px" }}
              type="primary"
              onClick={this.handleSearch}
            >
              历史结果查询
            </Button>
          </div>
          <div className="right">
            <div className="img-before">
              <h3>CT图片：</h3>
              <img src={this.state.imgBeforeUrl} alt="处理前的原图" />
            </div>
            <div className="img-after">
              <h3>分割结果：</h3>
              <img src={this.state.imgAfterUrl} alt="处理后的图片" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(CT);

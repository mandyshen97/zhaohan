import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./header.less";
import { formatDateToSecond } from "../../utils/dateUtils";
import { Icon} from "antd";

import menuList from "./../../config/menuConfig";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: formatDateToSecond(Date.now()),
    };
  }

  getTime = () => {
    this.intervalId = setInterval(() => {
      const currentTime = formatDateToSecond(Date.now());
      this.setState({ currentTime });
    }, 1000);
  };

  getTitle = () => {
    const path = this.props.location.pathname;
    let title;
    menuList.forEach(item => {
      if (item.path === path) {
        title = item.title;
      } else if (item.children) {
        const cItem = item.children.find(
          cItem => path.indexOf(cItem.path) === 0
        );
        if (cItem) {
          title = cItem.title;
        }
      }
    });
    return title;
  };

  logout = () => {
    this.props.history.replace("/login");
  };

  componentDidMount() {
    this.getTime();
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  handleCancel = () => {
    this.setState({
      ModalVisiable: false
    });
  };

  render() {
    const { currentTime } = this.state;
    const title = this.getTitle();

    return (
      <div className="header">
        <span className="page-title">{title}</span>
        <div className="header-right">
          <span className="currentTime">{currentTime}</span>
          <Icon type="question-circle" onClick={this.showDialog} />
          <span className="logout" onClick={this.logout}>
            退出
          </span>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);

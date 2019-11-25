import React, { Component } from 'react';
import { Layout, Breadcrumb } from 'antd'
import { Switch, Redirect, Route } from 'react-router-dom';
import menuList from '../../config/menuConfig'
import LeftNav from './../../components/left-nav/LeftNav';
import Header from '../../components/header/Header'
import Home from './../../components/home/Home';
import CT from '../../components/ct/ct'
import './admin.less'

const { Sider, Content } = Layout
class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    }
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  getTitle = () => {
    const path = this.props.location.pathname
    let title
    menuList.forEach(item => {
      if (item.path === path) {
        title = item.title
      } else if (item.children) {
        const cItem = item.children.find(cItem => path.indexOf(cItem.path) === 0)
        if (cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} style={{ height: '100vh' }} className="sider">
          <LeftNav path={this.props.location.pathname}></LeftNav>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Breadcrumb className='my-breadcrumb'>
            <Breadcrumb.Item>{this.getTitle()}</Breadcrumb.Item>
          </Breadcrumb>
          <Content>
            <Switch>
              <Redirect from='/' exact to='/home' />
              <Route path='/home'  component={Home} />
              <Route path='/ct' component={CT} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default Admin
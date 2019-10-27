/* eslint-disable jsx-a11y/accessible-emoji */
import React, { Component } from "react";
import {
  Container,
  Card,
  Button,
  // CardColumns,
  Badge,
  ButtonGroup
} from "react-bootstrap";
import { setIssues } from "../actions";
import { connect } from "react-redux";
// import { ReactComponent as Logo } from '../logo.svg';
// import { Link } from "react-router-dom";
import Head from "../components/head/head";
// import GET_ISSUSE from "../graphql/repository/issues/GET_ISSUSE"
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
// fetch('./setting.json').then(res=>{
//   console.log("setting,",res.text())
// })

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "首页",
      desc: "这里是显示内容的主页",
      message: "test",
      spaces: []
    };
    //console.log(props)
  }
  componentDidMount() {
    let { setIssues } = this.props;
    // console.log("Home 初始化")
    setIssues();
    const addNewStyle = {
      position: "fixed",
      bottom: "40px",
      width: "100px",
      height: "100px",
      right: "40px",
      fontSize: "100px",
      border: "5px solid",
      borderRadius: "50%",
      lineHeight: "65px",
      textAlign: "center"
    };
    this.setState({ addNewStyle });
  }
  componentWillReceiveProps(){
    //FIXED: SOLVE POSTINFOMATION 
    // console.log("reveiver props, there is to think how to solve question about post infomation and home isn't update.")
  }
  handleClick() {
    alert("home");
  }
  preClick(e, value) {
    let { setIssues } = this.props;
    let data = {};
    data.type = "previous";
    data.after = value;
    //console.log("设置上一页",data)
    setIssues(data);
  }
  nextClick(e, value) {
    let { setIssues } = this.props;
    let after = value;
    //console.log("设置下一页",after)
    setIssues({ after });
  }
  addNewSpace(e) {
    // location.href = 'edit/new';
  }
  toGithubComment = (index) =>{
    // console.log("数字",index)
    let url = 'https://github.com/abearxiong/abearxiong.github.io/issues/' + index
    window.open(url)
  }
  toEditIssues = (e, index) => {
    // e.preventdefault().
    e.stopPropagation()
    console.log("editIssues", this)
    // TODO: 判断是否缓存有内容
    this.props.history.push("/edit/"+index)
  }
  
  render() {
    // const { loading, error, data2 } = useQuery(GET_ISSUSE, {
    //   variables: { owner:"abearxiong.github.io", name: "abearxiong", first: 10 },
    // });
    // if (loading) return null;
    // if (error) return `Error! ${error}`;
    // console.log("data2", data2)
    let CardIssues;
    let ButtonNext = "",
      ButtonPre = "",
      CardTotalCount = "";
    if (this.props.state.setIssues.issues) {
      let issues = this.props.state.setIssues.issues;
      let edges = issues.edges;
      let pageInfo = issues.pageInfo;
      let totalCount = issues.totalCount;
      CardIssues = edges.map((list, index) => {
        let date = new Date(list.node.createdAt);
        let labelEdges = list.node.labels.edges
        let labels = labelEdges.map((labelList,index) => {
          return (<Badge pill  style={{backgroundColor:"#"+labelList.node.color }} id={labelList.node.id} key={labelList.node.id} title={labelList.node.description}>
             {labelList.node.name}
          </Badge>)
        })
        console.log("labels", labels)
        return (
          <Card key={ index } className="space-item">
            <Card.Header onClick={e=>this.toGithubComment(list.node.number)}>{list.node.title}<Badge variant="light" onClick={e=>this.toEditIssues(e, list.node.number)}>编辑</Badge></Card.Header>
            <Card.Title>{date.toLocaleString()}</Card.Title>
            <Card.Body
            >
              {labels}
              <Card border="light"  dangerouslySetInnerHTML={{ __html: list.node.bodyHTML }}></Card>
            </Card.Body>
            <Card.Footer>
              <Badge variant="light" onClick={e=>this.toGithubComment(list.node.number)}>
                    <g-emoji
                      alias="heart"
                      fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2764.png"
                      class="emoji mr-1"
                    >
                      ❤️
                    </g-emoji>
                  {list.node.reactions.totalCount}
              </Badge>

              <Badge variant="light" onClick={e=>this.toGithubComment(list.node.number)}>
                <g-emoji
                  class="g-emoji"
                  alias="speech_balloon"
                  fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f4ac.png"
                >
                  💬
                </g-emoji>
                {list.node.comments.totalCount}
              </Badge>
            </Card.Footer>
          </Card>
        );
      });
      if (pageInfo.hasPreviousPage) {
        ButtonPre = (
          <Button onClick={e => this.preClick(e, pageInfo.startCursor)}>
            上一页
          </Button>
        );
      }
      if (pageInfo.hasNextPage) {
        ButtonNext = (
          <Button onClick={e => this.nextClick(e, pageInfo.endCursor)}>
            下一页
          </Button>
        );
      }
      CardTotalCount = <div>{totalCount}</div>;
    } else {
      CardIssues = <Card>请稍等</Card>;
    }
    return (
      <Container className="xx-space">
        <Head {...this.props} />
        <Card>
          <Card.Body>{CardIssues}</Card.Body>
          <ButtonGroup>
            {ButtonPre}
            {ButtonNext}
          </ButtonGroup>
          <Card.Footer>{CardTotalCount}</Card.Footer>
        </Card>
        {/* <Link style={this.state.addNewStyle} to={{ pathname: "/edit/new" }}>
          +
        </Link> */}
      </Container>
    );
  }
}

// mapStateToProps：将state映射到组件的props中
const mapStateToProps = state => {
  console.log("state 映射", state);
  return {
    state
  };
};
// mapDispatchToProps：将dispatch映射到组件的props中
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setIssues(data) {
      dispatch(setIssues(data));
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import _ from "lodash";
import { css } from "@emotion/core";

import InfiniteScroll from "react-infinite-scroller";

import { FiXCircle, FiArrowLeft } from "react-icons/fi";
import RotateLoader from "react-spinners/RotateLoader";
import Iframe from "react-iframe";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export class Loading extends Component {
  render() {
    return (
      <div className="centered" style={{ width: "367px" }}>
        <RotateLoader
          css={override}
          sizeUnit={"px"}
          size={15}
          color={"#f68a56"}
        />
      </div>
    );
  }
}

export class Loading2 extends Component {
  render() {
    return (
      <div className="centered" style={{ width: "493px", height: "442px" }}>
        <RotateLoader
          css={override}
          sizeUnit={"px"}
          size={15}
          color={"#f68a56"}
        />
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      end: 10,
      loading: false,
      searchOpened: true,
      userSearchQuery: "",
      headings: [],
      links: [],
      linkClicked: false,
      linkLoading: false,
      linkState: "",
      title: ""
    };

    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.handleLinkClickBack = this.handleLinkClickBack.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchClose = this.handleSearchClose.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.loadHandle = this.loadHandle.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  handleClickOutside(event) {
    // console.log(event)
  }

  handleSearch() {
    if (this.state.userSearchQuery.length === 0) {
    } else {
      this.setState({ searchOpened: false });
    }
  }

  handleSearchClose() {
    this.setState({ searchOpened: true,loading:false });
  }

  fetchList(text) {
    if (text.length !== 0) {
      console.log(text);
      fetch(`http://localhost:8000/headings?query=${text}`, {
        method: "GET"
      })
        .then(res => res.json())
        .then(data2 => {
          if (data2.headings===null) {
            this.setState({ loading: false });
          } else {
            this.setState({
              headings: data2.headings,
              links: data2.links,
              loading: false,
              end: 10
            });
          }
        })
        .catch(err => {});
      // fetch(`http://localhost:8000/headings?query=${text}`, {
      //   method: "GET"
      // })
      //   .then(res => res.json())
      //   .then(data => {
      //     this.setState({ headings: data.slice(0, 10) }, () => {
      //       this.setState({ loading: false });
      //     });
      //   })
      //   .catch(err => {});
    }
  }

  makeRemoteRequest = _.debounce(() => {
    this.setState({ headings: [] });
    if (this.state.userSearchQuery === "") {
      this.handleSearchClose();
    } else {
      this.setState({ searchOpened: false });
      this.fetchList(this.state.userSearchQuery);
    }
  }, 400);

  handleLinkClick(link, title) {
    console.log(link);
    this.setState({
      linkClicked: true,
      linkState: link,
      title: title,
      linkLoading: true
    });
    setTimeout(() => {
      this.setState({ linkLoading: false });
    }, 2100);
  }

  handleLinkClickBack() {
    this.setState({ linkClicked: false, linkState: "", loading: false });
  }

  updateQuery = text => {
    this.setState({ loading: true, linkClicked: false });
    let formatQuery = text;
    this.setState({ userSearchQuery: formatQuery }, () => {
      this.makeRemoteRequest();
    });
  };

  loadHandle() {
    this.setState({ loading: false });
  }

  handleScroll = e => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (!this.state.linkClicked)
      if (bottom) {
        this.setState({ end: this.state.end + 10 });
      }
  };

  handleLoadMore() {
    console.log("hey");
    this.setState({ end: this.state.end + 10 });
  }

  render() {
    const iframeHere = `<iframe is="x-frame-bypass" style="position: absolute;
    top: -300px;
    left: -15px;
    width: 500px;
    height:15000px" src=${
      this.state.linkState
    } frameborder="0" width="410px" height="1500px" style="background-color: #fff;" scrolling="no"/>`;
    const { headings, links } = this.state;
    return (
      <div className="App">
        <div
          className={
            "loadMore2 box sb1 " +
            (this.state.userSearchQuery.length > 0 ? "hide" : "")
          }
        >
          Need Help ?
        </div>



        <div
          className={
            "loadMore3 box sb1 " +
            (this.state.userSearchQuery.length > 0 && this.state.headings.length === 0 && !this.state.searchOpened ? "show" : "")
          }
        >
          Oopps, no result.
        </div>

        {this.state.userSearchQuery.length === 0 ? (
          ""
        ) : (
          <div
            className={
              "loadMore3 box sb1 " + (this.state.loading ? "show" : "")
            }
          >
            Please wait, I'm working on it...
          </div>
        )}
        <div
          className={
            "loadMore3 box sb1 " +
            (this.state.linkState.length === 0 ? " " : "show ") +
            (this.state.searchOpened ? "hide" : "")
          }
        >
          {this.state.linkLoading ? "Just a sec..." : "There you go."}
        </div>
        <div className="launchBox">
          <div
            className={
              "resultBox-title " +
              (!this.state.searchOpened ? "show " : " ") +
              (this.state.linkClicked ? " widthFix " : " ") +
              (this.state.loading ? " heightFix " : " ") + 
              (this.state.headings.length===0 && !this.state.searchOpened ? " heightFix2" : "")
            }
            onScroll={this.handleScroll}
          >
            <FiArrowLeft
              onClick={this.handleLinkClickBack}
              size={24}
              color="#fff"
              className={" " + (this.state.linkClicked ? "show" : "")}
              style={{
                visibility: "hidden",
                opacity: 0,
                cursor: "pointer",
                marginRight: 12,
                marginTop: 3
              }}
            />

            {this.state.linkClicked ? (
              this.state.title
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <div>Search for </div>

                {this.state.userSearchQuery.length > 0 ? (
                  <div
                    style={{
                      padding: "1px 5px",
                      borderRadius: "4px",
                      background: "white",
                      color: "#ef662d",
                      marginLeft: "5px"
                    }}
                  >
                    {this.state.userSearchQuery}
                  </div>
                ) : (
                  ""
                )}
              </div>
            )}

            <FiXCircle
              onClick={this.handleSearchClose}
              size={24}
              color="#fff"
              style={{ cursor: "pointer", marginRight: 12, marginTop: 3 }}
            />
          </div>
          <div
            className={"resultBox " + (!this.state.searchOpened ? "show" : "")}
          >
            <div className="resultBox-results">
              {this.state.loading ? (
                <Loading />
              ) : this.state.linkClicked ? (
                <div>
                  <div
                    className={
                      "" + (this.state.linkLoading ? "" : "displayHidden")
                    }
                  >
                    <Loading2 />
                  </div>
                  <div
                    className={
                      "linkDetail " +
                      (this.state.linkLoading ? "" : "displayBlock")
                    }
                    dangerouslySetInnerHTML={{ __html: iframeHere }}
                  />
                </div>
              ) : this.state.headings.length !== 0 ? (
                <div
                  className="scrollThumb"
                  style={{
                    height: "441px",
                    overflowX: "hidden",
                    overflowY: "auto"
                  }}
                  ref={ref => (this.scrollParentRef = ref)}
                >
                  <InfiniteScroll
                    pageStart={0}
                    loadMore={this.handleLoadMore.bind(this)}
                    hasMore={this.state.end < this.state.headings.length}
                    useWindow={false}
                    getScrollParent={() => this.scrollParentRef}
                    loader={<div key={0}>Loading ...</div>}
                  >
                    {headings
                      .slice(this.state.start, this.state.end)
                      .map((item, index) => (
                        <ul>
                          <a
                            title={item}
                            style={{ cursor: "pointer" }}
                            // target="_blank" href={links[index]}
                            onClick={() =>
                              this.handleLinkClick(links[index], item)
                            }
                          >
                            <li>{item}</li>
                          </a>
                        </ul>
                      ))}
                  </InfiniteScroll>
                  <div
                    className={
                      "loadMore box sb1 " +
                      (this.state.headings.length > 0 ? "show" : "")
                    }
                    // onClick={this.handleLoadMore.bind(this)}
                  >
                    Here you go
                  </div>
                </div>
              ) : (
                <div style={{display:"flex",alignItems:"center",justifyContent:"center", height:"50px",fontSize:"1rem"}}>Nothing to show</div>
              )}
            </div>
          </div>
          <div className="positionRelative">
            <input
              value={this.state.userSearchQuery}
              onChange={event => this.updateQuery(event.target.value)}
              onFocus={this.handleSearch}
              // onBlur={this.handleSearchClose}
              placeholder="How to ..."
              className="needHelpInput"
            />

            <img
              className={"podoImg " + (this.state.loading ? "podoJump" : "")  + (this.state.linkLoading ? "podoJump" : "")}
              src="https://cdn.jotfor.ms/assets/img/memberkit/answers-header-search-podo.png"
              width="50px"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

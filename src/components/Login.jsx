import React, { Component } from "react";
import axios from "axios";
import { FacebookProvider, LoginButton } from "react-facebook";
import WebsiteTemplate from "./WebsiteTemplate";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogged: false,
      userData: "",
      page1: "",
      pageLoaded: "notLoaded",
      loadTemplate: false,
    };
  }
  handleResponse = (data) => {
    this.setState({
      isLogged: true,
      userData: data,
    });
  };

  handleError = (error) => {
    console.log(error);
  };

  handleTemplate = () => {
    this.setState({
      loadTemplate: true,
    });
  };

  makeCall = async () => {
    try {
      let findingPages = await axios.get(
        `https://graph.facebook.com/v6.0/${this.state.userData.profile.id}/accounts?access_token=${this.state.userData.tokenDetail.accessToken}`
      );
      let userPagesData = findingPages.data.data[0];
      let findingDetailsOfPage1, profilePictureOfPage1;
      if (userPagesData) {
        findingDetailsOfPage1 = await axios.get(
          `https://graph.facebook.com/v6.0/${userPagesData.id}?fields=about,products,cover,single_line_address,temporary_status,username,website,roles,emails&access_token=${this.state.userData.tokenDetail.accessToken}`
        );
        profilePictureOfPage1 = await axios.get(
          `https://graph.facebook.com/v6.0/${userPagesData.id}/picture?type=large&access_token=${this.state.userData.tokenDetail.accessToken}`
        );
      }
      let dataPage1 = {
        currentPageId: userPagesData.id,
        currentPageName: userPagesData.name,
        currentPageCategory: userPagesData.category,
        currentPageAbout: findingDetailsOfPage1.data.about,
        currentPageProducts: findingDetailsOfPage1.data.products,
        currentPageCover: findingDetailsOfPage1.data.cover.source,
        currentPageAddress: findingDetailsOfPage1.data.single_line_address,
        currentPageTemporaryStatus: findingDetailsOfPage1.data.temporary_status,
        currentPageUsername: findingDetailsOfPage1.data.username,
        currentPageWebsite: findingDetailsOfPage1.data.website,
        currentPageEmails: findingDetailsOfPage1.data.emails[0],
        currentPageProfileImage: profilePictureOfPage1.request.responseURL,
      };

      this.setState({
        page1: dataPage1,
        pageLoaded: true,
      });
    } catch (err) {
      this.setState(
        {
          pageLoaded: false,
        },
        () => console.log(err)
      );
    }
  };

  render() {
    let fbData;
    if (this.state.isLogged) {
      fbData = null;
    } else {
      fbData = (
        <FacebookProvider appId="2646351118977832">
          <LoginButton
            className="btn btn-primary btn-lg"
            scope="email,manage_pages"
            onCompleted={this.handleResponse}
            onError={this.handleError}
          >
            <span className="text-white">Login via Facebook</span>
          </LoginButton>
        </FacebookProvider>
      );
    }
    if (this.state.loadTemplate) {
      return (
        <WebsiteTemplate
          profileUrl={this.state.page1.currentPageProfileImage}
          coverUrl={this.state.page1.currentPageCover}
          name={this.state.page1.currentPageName}
          about={this.state.page1.currentPageAbout}
          products={this.state.page1.currentPageProducts}
          status={this.state.page1.currentPageTemporaryStatus}
          address={this.state.page1.currentPageAddress}
          website={this.state.page1.currentPageWebsite}
          email={this.state.page1.currentPageEmails}
        />
      );
    }
    return (
      <div>
        {!this.state.isLogged ? (
          <div>
            <div className="text-center mt-3">
              <img
                src="https://miro.medium.com/max/3150/2*_iEfshM05w9D8Fa-HB-LlA.png"
                className="col-3 mb-5 img-fluid"
                alt="logo"
              />
              <p className="h3">Assignment</p>
              <p className="h5 text-primary mt-2 mb-5">
                Click the button below to login{" "}
              </p>
              {fbData}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="display-3 my-3">Logged In</p>
            <p className="h4 my-3 text-primary">
              Welcome, {this.state.userData.profile.name}
            </p>
            <button
              onClick={this.makeCall}
              type="button"
              className={
                this.state.pageLoaded == false
                  ? "btn btn-danger"
                  : this.state.pageLoaded == true
                  ? "btn btn-success"
                  : "btn btn-info"
              }
            >
              Fetch FB page data
            </button>
            {this.state.pageLoaded == true && (
              <div className="my-4">
                <p className="h4 mb-3">Data Fetched Successfully</p>
                <p className="my-3">
                  Page : {this.state.page1.currentPageName}
                </p>
                <button
                  onClick={this.handleTemplate}
                  className="btn btn-outline-warning"
                >
                  Create site now
                </button>
              </div>
            )}
            {this.state.pageLoaded == false && (
              <div className="my-4">
                <p className="h4 mb-3">Data Fetching Failed</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

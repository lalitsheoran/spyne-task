import React from "react";

export default class WebsiteTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      profileUrl,
      coverUrl,
      name,
      about,
      products,
      status,
      address,
      email,
      website,
    } = this.props;
    return (
      <div className="container">
        <div className="text-center">
          <img
            className="img-fluid rounded-circle my-4"
            src={profileUrl}
            alt=""
          />
          <h3 className="mb-3">{name}</h3>
        </div>
        <p
          style={{
            backgroundImage: `url(${coverUrl})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: "50px",
          }}
          className="p-3 mt-3 text-white display-4"
        >
          {about}
        </p>
        <p className="my-5 h4 text-warning text-center">Our offerings</p>
        <p className="h5 text-center mb-3">{products}</p>
        <div className="d-flex justify-content-around">
          <img className="col-3 img-fluid" src="./u1.png" alt="u1" />
          <img className="col-3 img-fluid" src="./u2.png" alt="u2" />
          <img className="col-3 img-fluid" src="./u3.png" alt="u3" />
        </div>
        <p className="my-3 h4 text-warning text-center">Current Status</p>
        <p className="h5 text-center mb-3">{status}</p>
        <p className="text-primary h4">Contact Us</p>
        <div>
          <p>{address}</p>
          <p>{email}</p>
          <p>{website}</p>
        </div>
      </div>
    );
  }
}

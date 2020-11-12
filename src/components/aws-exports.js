const awsmobile = {
  Auth: {
    // Amazon Cognito Region
    region: "us-east-1",

    // Amazon Cognito User Pool ID
    userPoolId: process.env.REACT_APP_USER_POOL_ID,

    // Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID
  }
};

export default awsmobile;

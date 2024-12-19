// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the
// `bin/rails generate channel` command.
import { createConsumer } from "@rails/actioncable";
import { hainsOAuth } from "../tools/helper";

export default () => {
  const token = hainsOAuth?.getAuthResponse && hainsOAuth.getAuthResponse()?.access_token;
  let consumer = false;
  if (token) {
    consumer = createConsumer(`ws://localhost/cable?access_token=${token}`);
  } else {
    consumer = createConsumer();
  }

  return consumer;
};

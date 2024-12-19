import consumer from "./consumer";

const appChannel = (
  appModel
) => consumer().subscriptions.create({
  channel: "AppChannel"
}, {
  connected() {
    appModel?.online?.();
  },
  disconnected() {
    appModel?.offline?.();
  },
  rejected() {
    appModel?.offline?.();
  },
  received: (data) => {
    appModel?.receive?.(data);
  }
});

export default appChannel;
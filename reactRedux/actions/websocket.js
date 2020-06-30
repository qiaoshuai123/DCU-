//定义 websocket connection
let options = {
  maxRetries: 5
};
// 把rws 定义在外面是方便断开连接
let rws = null;
// async 执行异步方法 
async function initWebsocket(obj) {

  let url = "你的url地址";
  // 建立websocket 连接
  rws = new ReconnectingWebSocket(url, [], options);

  rws.addEventListener("open", async () => {
      if (!rws) return;   
      // 这里可以拿到你传过来的 name
      let ticket = {
           "aaa": obj.name
       };

      if (rws.readyState === 1) {
         // 这个是你给websocket 传输它要的东西
          rws.send(JSON.stringify(ticket));
       }
   });

  rws.addEventListener("message", e => {
      if (e.data) {
      // 这里是你拿到数据后进行的处理
      //你可以调用action 来触发消息给页面上展示 例如 这些消息方法需要你自己来封装
      store.dispath(action.success(e.data))
     }
   });

  // 错误时进行的处理
  rws.addEventListener("error", e => {
      console.error(e.message);
   });
  // 关闭时进行的操作
  rws.addEventListener("close", () => {
      rws = null;
      console.info("asset service disconnected.");
   });
}

//来写sagas的处理方法 
function Connect(name) {
  initWebsocket(name);
}

function Disconnect(result) {
  // 为什么要使用while呢,因为我们的页面上有可能不只 创建了一个websocket连接
  while(rws) {
       rws.close(1000, result);
   }
}

function* connectSaga() {
  yield takeEvery(CONNECT_WEBSOCKET , Connect);
}
function* disconnectSaga() {
  yield takeEvery(DISCONNECT_WEBSOCKET , Disconnect);
}

export default function* root() {
  yield [
      fork(connectSaga),
      fork(disconnectSaga)
   ];
}
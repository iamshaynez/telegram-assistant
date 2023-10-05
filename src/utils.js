
// 渲染一个 HTML
export function renderHTML(body) {
    return `
  <html>  
    <head>
      <title>Telegram-Counter</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="author" content="Xiaowen.Z">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          color: #212529;
          text-align: left;
          background-color: #fff;
        }
        h1 {
          margin-top: 0;
          margin-bottom: 0.5rem;
        }
        p {
          margin-top: 0;
          margin-bottom: 1rem;
        }
        a {
          color: #007bff;
          text-decoration: none;
          background-color: transparent;
        }
        a:hover {
          color: #0056b3;
          text-decoration: underline;
        }
        strong {
          font-weight: bolder;
        }
      </style>
    </head>
    <body>
      ${body}
    </body>
  </html>
    `;
}

// 组装错误信息成文本，方便发送
export function errorToString(e) {
    return JSON.stringify({
        message: e.message,
        stack: e.stack,
    });
}

// 拼凑小助手的消息发送模板
export function assistantMessage(text) {
    return `---- 小助手消息 ----\r\n${text}\r\n--------------------`;
}

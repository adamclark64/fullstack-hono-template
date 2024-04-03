import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { hc } from "hono/client";
import "./App.css";
import { AppType } from "@repo/backend";
import { useQuery } from "@tanstack/react-query";

function App() {
  const client = hc<AppType>("http://0.0.0.0:3000/");
  const [count, setCount] = useState({ ip: "", id: "", count: 0 });
  const [ip, setIp] = useState("");
  const [logs, setLogs] = useState([]);

  useQuery({
    queryKey: ["initial"],
    queryFn: async () => {
      const ipres = await fetch("http://ip-api.com/json/");
      const ipValue = await ipres.json();
      const ipString = JSON.stringify(ipValue);
      console.log("ipString: ", ipString);
      setIp(ipString);

      const res = await client.v1.log.$post({
        query: {
          ts: Date.now().toString(),
          ip: ipString,
        },
      });
      const allLogs = await client.v1.log.$get();
      setLogs(await allLogs.json());
      
      const currentCount = await client.v1.count.$get({
        query: {
          ip: ipString,
        },
      });
      setCount(await currentCount.json());
      return res.json();
    },
  });

  const handleCountClick = async () => {
    await client.v1.count.$post({
      form: {
        ip: count.ip,
        id: count.id,
      },
    });
    setCount({ ...count, count: (count.count += 1) });
  };

  const handleClearLogs = async () => {
    await client.v1.log.$delete();
    setLogs([]);
  };

  const handleResetCount = async () => {
    await client.v1.count[":id"].$delete({
      param: { id: count.id },
    });
    setCount({
      ...count,
      count: 0,
    });
  };

  console.log("logs", logs);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => handleCountClick()}>
          count is {count.count}
        </button>
        <br />
        <br />
        <button onClick={() => handleResetCount()}>reset counter</button>
        <button onClick={() => handleClearLogs()}>
          clear all log recrods (total: {logs.length})
        </button>
        <h3>ip info</h3>
        <code>{ip}</code>
        <ol
          style={{
            maxHeight: 300,
            overflow: "scroll",
            border: "1px solid white ",
          }}
        >
          {logs.map((log) => (
            <li>{JSON.stringify(log, null, 2)}</li>
          ))}
        </ol>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;

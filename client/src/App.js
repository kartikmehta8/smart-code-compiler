import React, { useState, useEffect } from "react";
import axios from "axios";
import AceEditor from "react-ace";
import { jsPDF } from "jspdf";
import copy from "./copy.png";
import pdf from "./pdf.png";
import moment from "moment";
import alanBtn from '@alan-ai/alan-sdk-web';
// import stubs from "./defaultStubs";

function App() {
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [language, setLanguage] = useState("cpp");
    const [name, setName] = useState("default-code");
    const [status, setStatus] = useState("");
    const [jobId, setJobId] = useState("");
    const [jobDetails, setJobDetails] = useState(null);

    useEffect(() => {
        const defaultLang = localStorage.getItem("default-language") || "cpp";
        setLanguage(defaultLang);
    }, []);

    var doc = new jsPDF();
    doc.text(code, 15, 15);

    const setDefaultLanguage = () => {
        localStorage.setItem("default-language", language);
        console.log(`${language} set as default language!`);
    };

    const handleSubmit = async () => {
        console.log(code);
        const payload = {
            language: language,
            code,
        };
        try {
            const { data } = await axios.post(
                "http://localhost:5000/run",
                payload
            );
            console.log(data);
            setJobId(jobId);
            setJobDetails(null);
            setStatus("");
            setOutput("");

            let intervalId;

            intervalId = setInterval(async () => {
                const { data: dataResult } = await axios.get(
                    "http://localhost:5000/status",
                    { params: { id: data.jobId } }
                );

                const { success, job, error } = dataResult;
                console.log(dataResult);

                if (success) {
                    const { status: jobStatus, output: jobOutput } = job;
                    setStatus(jobStatus);
                    setJobDetails(job);
                    if (jobStatus === "pending") return;
                    setOutput(jobOutput);
                    clearInterval(intervalId);
                } else {
                    setStatus("ERROR");
                    console.log(error);
                    clearInterval(intervalId);
                    setOutput(error);
                }

                console.log(dataResult);
            }, 1000);
        } catch ({ response }) {
            if (response) {
                const errMsg = response.data.err.stderr;
                setOutput(errMsg);
            } else {
                setOutput("Error connecting to server!");
            }
        }
    };

    //SOMETHING WENT WRONG RENDERTIMEDETAILS

    const renderTimeDetails = () => {
        console.log(`JOB DETAILS : ${jobDetails}`);
        if (!jobDetails) {
            return "";
        }
        let result = "";

        let { submittedAt, completedAt, startedAt } = jobDetails;
        submittedAt = moment(submittedAt).toString();
        result += `Submitted At :  ${submittedAt}`;

        if (!completedAt || !startedAt) {
            return result;
        }

        const start = moment(startedAt);
        const end = moment(completedAt);
        const executionTime = end.diff(start, "seconds", true);
        result += `Execution Time : ${executionTime}`;

        return result;
    };

    // useEffect(() => {
    //     setCode(stubs[language]);
    //     console.log(stubs[language]);
    // }, [language]);

    useEffect(() => {
        alanBtn({
            key: 'e6f0bf4fca3358f5d610608f6aad42102e956eca572e1d8b807a3e2338fdd0dc/stage',
            onCommand: (commandData) => {
              if (commandData.command === 'go:back') {
                // Call the client code that will react to the received command
              }
            }
        });
      }, []);

    

    return (
        <div className="mx-8">
            <h1 className="flex justify-center ubuntu text-3xl p-4 text-gray-800 border-black border-b-2">
                SMART CODE COMPILER
            </h1>
            <div className="">
                <div>
                    <div className="flex p-4 ml-12">
                        {/* <label>Language &nbsp;</label> */}
                        <select
                            className=""
                            value={language}
                            onChange={(e) => {
                                let response = window.confirm(
                                    "Are you sure you want to switch the tab?"
                                );
                                if (response) {
                                    setLanguage(e.target.value);
                                }
                            }}
                        >
                            <option value="c">C</option>
                            <option value="cpp">C++</option>
                            <option value="py">Python</option>
                            <option value="js">Javascript</option>
                        </select>
                        <br />
                        &nbsp;&nbsp;
                        <button
                            onClick={setDefaultLanguage}
                            className="bg-green-600 px-2 text-white ubuntu"
                        >
                            Set Default Language
                        </button>
                        &nbsp;&nbsp;
                        <button
                            onClick={handleSubmit}
                            className="bg-red-600 text-white px-2 ubuntu"
                        >
                            <div className="flex">
                                SUBMIT&nbsp;
                                <img
                                    alt="PLAY"
                                    src="https://img.icons8.com/ios-glyphs/30/000000/play--v1.png"
                                    style={{
                                        height: "15px",
                                        width: "15px",
                                        marginTop: "5px",
                                    }}
                                />
                            </div>
                        </button>
                        &nbsp;&nbsp;
                        <button
                            className="bg-yellow-500 text-white px-2 ubuntu"
                            onClick={() => navigator.clipboard.writeText(code)}
                        >
                            <div className="flex">
                                Copy Code&nbsp;&nbsp;
                                <img
                                    style={{
                                        height: "15px",
                                        width: "15px",
                                        marginTop: "5px",
                                    }}
                                    src={copy}
                                    alt="CP"
                                />
                            </div>
                        </button>
                        &nbsp;&nbsp;
                        <input
                            type="text"
                            id="fname"
                            name=""
                            placeholder=" Name"
                            className="border-2 border-black border-r-0"
                            onChange={(e) => {
                                setName(e.target.value);
                                console.log(name);
                            }}
                        />
                        <button
                            className="bg-blue-600 text-white px-4 ubuntu border-black border-2 border-l-0"
                            onClick={() => {
                                doc.save(`${name}.pdf`);
                            }}
                        >
                            <div className="flex">
                                Save PDF&nbsp;&nbsp;
                                <img
                                    style={{
                                        height: "15px",
                                        width: "15px",
                                        marginTop: "5px",
                                    }}
                                    alt="PDF"
                                    src={pdf}
                                />
                            </div>
                        </button>
                    </div>

                    {/* <br /> */}

                    <div className="flex terminal justify-center terminal">
                        <AceEditor
                            className="border-2 border-gray-700 mx-8"
                            mode="javascript"
                            theme=""
                            value={code}
                            height="75vh"
                            placeholder="CODE"
                            width="60%"
                            wrapEnabled="true"
                            onChange={(e) => {
                                setCode(e);
                            }}
                            fontSize={16}
                            showPrintMargin={true}
                            showGutter={true}
                            highlightActiveLine={true}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                enableSnippets: true,
                                showLineNumbers: true,
                                tabSize: 4,
                            }}
                        />
                        <div className="grid grid-cols-1 justify-center">
                            <div className="grid grid-cols-1">
                                <div className="flex justify-end pr-2 bg-gray-100 ubuntu border-t-2 border-l-2 border-r-2 border-black">
                                    Notes
                                </div>
                                <textarea
                                    className="h-full w-full border-2 border-black p-2 border-t-0"
                                    placeholder="NOTES"
                                    style={{ height: "210px", width: "500px" }}
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-1 mt-4">
                                <div className="flex justify-end bg-gray-100 pr-2 ubuntu">
                                    Output Screen
                                </div>
                                <div
                                    className="h-full w-full bg-black text-white p-4"
                                    style={{ height: "230px", width: "500px" }}
                                >
                                    {output}
                                </div>
                                {!status ? <div className="flex justify-center bg-gray-300 pr-2 ubuntu text-white">
                                    {status} &nbsp; &nbsp;{" "}
                                </div> : status === "error" ? <div className="flex justify-center bg-red-600 text-white pr-2 ubuntu">
                                    {status.toUpperCase()} &nbsp; &nbsp;{" "}
                                </div> : (status === "pending") ? <div className="flex justify-center bg-yellow-500 text-white pr-2 ubuntu">
                                    {status.toUpperCase()} &nbsp; &nbsp;{" "}
                                </div> : <div className="flex justify-center bg-green-600 pr-2 ubuntu text-white">
                                    {status.toUpperCase()} &nbsp; &nbsp;{" "}
                                </div>}
                            </div>
                        </div>
                    </div>
                    <br />
                </div>
            </div>
            <p>{renderTimeDetails}</p>
            {/* <p>{jobId && `JobID : ${jobId}`}</p> */}
        </div>
    );
}

export default App;

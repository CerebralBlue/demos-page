"use client";
// filepath: my-nextjs-app/pages/demos/rfp_writer.tsx
import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import axios from 'axios';

const RFPWriterAgent: React.FC = () => {
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    var file_data: any;
    var sheetName: any;
    var columnName: any = null;
    var question_queue: any = [];
    const getFileMetadata = async (file: File) => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        const metadata: any = {};

        if (ext === 'xlsx') {
            metadata.type = 'xlsx';
            metadata.sheets = [];
            metadata.columns = {};
            metadata.rows = {};

            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            metadata.sheets = workbook.SheetNames;

            workbook.SheetNames.forEach(sheetName => {
                const worksheet = workbook.Sheets[sheetName];
                const range = XLSX.utils.decode_range(worksheet['!ref']!);

                const columnNames = [];
                for (let col = range.s.c; col <= range.e.c; col++) {
                    const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
                    const cellValue = worksheet[cellAddress]?.v || '';
                    columnNames.push(cellValue);
                }
                metadata.columns[sheetName] = columnNames;
                metadata.rows[sheetName] = range.e.r - range.s.r;
            });
        } else if (ext === 'csv') {
            metadata.type = 'csv';
            metadata.columns = [];
            metadata.rows = 0;

            const text = await file.text();
            const parsed = Papa.parse(text, { header: true });
            metadata.columns = parsed.meta.fields;
            metadata.rows = parsed.data.length;
        }

        return metadata;
    };
    const selectSheet = (event: React.MouseEvent<HTMLLIElement>, file_metadata: any) => {
        const li = event.currentTarget;
        const sheetName = li.textContent;

        if (!sheetName) return;

        li.classList.add("selected");

        const columns = file_metadata.columns[sheetName];

        const ul = document.createElement("ul");
        ul.style.listStyle = "none";
        ul.style.padding = "0";

        columns.forEach((column: string) => {
            const columnLi = document.createElement("li");
            columnLi.textContent = column;
            columnLi.style.display = "inline-block";
            columnLi.style.padding = "6px 12px";
            columnLi.style.margin = "4px";
            columnLi.style.backgroundColor = "#e0e0e0";
            columnLi.style.borderRadius = "6px";
            columnLi.style.cursor = "pointer";
            columnLi.addEventListener('click', () => selectColumn(columnLi.textContent!));

            ul.appendChild(columnLi);
        });

        event.currentTarget.parentElement?.querySelectorAll(".selected").forEach((el) => {
            el.classList.remove("selected");
        });

        event.currentTarget.classList.add("selected");
        event.currentTarget.appendChild(ul);
    };

    async function seek(text: any, url: any, apikey: any, filter = '', prompt = '', session_id = '') {
        const _options = {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'apikey': apikey
            }
        };

        // message payload
        var data: any = {
            question: text
        };

        // add session if session has value
        if (session_id != '') {
            data['user_session'] = {
                system: {
                    session_id: session_id
                }
            };
        }

        if (filter != '') {
            if (!data['options']) {
                data['options'] = {};
            }
            data['options']['filter'] = filter;
        }

        // add prompt if prompt has value
        if (prompt != '') {
            if (!data['options']) {
                data['options'] = {};
            }
            data['options']['promptEngineering'] = true;
            data['options']['promptEngineeringPhrase'] = prompt;
        }

        try {
            const response = await axios.post(url + "/seek", data, _options);
            return response.data;
            //   res.json(response.data);
            //   res.status(200);
        } catch (error) {
            console.error('An error occurred while running seek:', error);
            throw error;
        }
    };
    const answer_question = async () => {
        if (question_queue.length > 0) {
            const row = question_queue.shift();
            var row_no = row.row;
            var question = row.data[columnName];
            var answer_div = document.getElementById(`answer_${row_no}`);
            answer_div!.textContent = "Working...";

            const result = await seek(question, "https://stagingapi.neuralseek.com/v1/NS-ES-V2", "e907252c-a14c702d-a0ae2b3b-490872cd");
            if (answer_div) {
                var answer = result['answer'];
                answer += ` (semantic score:${result['semanticScore']}, kbCoverage:${result['kbCoverage']})`;
                answer_div.textContent = answer;
                answer_question();
            }

        }
    }
    const write_rfp_answer = () => {
        // get the file data
        const data = file_data.data;
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            question_queue.push(row);
        }
        answer_question();
    }
    const [tableComponent, setTableData] = useState<React.ReactNode>(null);
    const downloadTableContent = () => {
        const table = document.querySelector("table");
        if (!table) return;
    
        let csvContent = "";
        const rows = table.querySelectorAll("tr");
    
        rows.forEach(row => {
            const cols = row.querySelectorAll("td, th");
            const rowData = Array.from(cols).map(col => col.textContent?.trim()).join(",");
            csvContent += rowData + "\n";
        });
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "table_data.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const renderData = (selectedColumnName: string) => {
        columnName = selectedColumnName;
        setTableData(
            <div>
                <div style={{ marginBottom: '16px' }}>
                    Here are the data with selected column as question. Press RUN button to start writing answers.
                </div>
                <button
                    className='button'
                    style={{ padding: '8px', width: '100%', backgroundColor: '#3D91F0', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    onClick={write_rfp_answer}>
                    RUN
                </button>
                <div style={{ overflow: 'auto', maxHeight: '400px' }} className='mb-4 mt-4'>
                    <table className="w-full border-collapse mt-0 table-auto border border-white" style={{ borderWidth: '5px' }}>
                        <thead>
                            <tr className="bg-[#3D91F0]">
                                <th className="p-2 text-white" style={{ borderWidth: '4px',whiteSpace: 'nowrap' }}>Row</th>
                                <th className="p-2 text-white" style={{ borderWidth: '4px',whiteSpace: 'nowrap' }}>{selectedColumnName}</th>
                                <th className="p-2 text-white" style={{ borderWidth: '4px',width: '100%' }}>Answer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {file_data.data.map((row: any, index: number) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                    <td className="p-2 text-black text-center border border-white" style={{ borderWidth: '4px', whiteSpace: 'nowrap' }}>{row.row}</td>
                                    <td className="p-2 text-black border border-white" style={{ borderWidth: '4px', whiteSpace: 'nowrap' }}>{row.data[selectedColumnName]}</td>
                                    <td className="p-2 text-black border border-white" id={`answer_${row.row}`} style={{ borderWidth: '4px', width: '100%' }}></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };
    
    


    const selectColumn = (event: string) => {
        renderData(event);

    }
    const handleFileUpload = async (filename: string, file: File) => {
        setFileName(filename);
        const file_uploaded_div = document.getElementById('file_name');
        const file_metadata_div = document.getElementById('file_meta');

        if (file_uploaded_div) {
            file_uploaded_div.setAttribute('filename', filename);
            file_uploaded_div.innerHTML = `📄 <a href='/api/files/${filename}' target='_blank'>${filename}</a>`;
            file_uploaded_div.style.display = 'block';
        }

        try {
            const metadata = await getFileMetadata(file);

            if (file_metadata_div) {
                file_metadata_div.innerHTML = "";

                if (metadata.type === "csv") {
                    file_metadata_div.innerHTML += `<div><strong>Total Rows:</strong> ${metadata.rows}</div>`;
                    file_metadata_div.innerHTML += `<h2><b>List of Columns</b></h2>`;
                    file_metadata_div.innerHTML += `<div>Please select one of the columns as 'questions.'</div>`;

                    const hr_list_div = document.createElement("div");
                    hr_list_div.classList.add("hr_list");

                    const ul = document.createElement("ul");
                    ul.style.listStyle = "none";
                    ul.style.padding = "0";

                    metadata.columns.forEach((col: string) => {
                        const li = document.createElement("li");
                        li.textContent = col;
                        li.style.display = "inline-block";
                        li.style.padding = "6px 12px";
                        li.style.margin = "4px";
                        li.style.backgroundColor = "#3D91F0";
                        li.style.borderRadius = "6px";
                        li.style.color = "white";
                        li.style.cursor = "pointer";
                        li.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
                        li.addEventListener('click', () => selectColumn(li.textContent!));
                        ul.appendChild(li);
                    });

                    hr_list_div.appendChild(ul);
                    file_metadata_div.appendChild(hr_list_div);

                } else if (metadata.type === "xlsx") {
                    file_metadata_div.innerHTML += `<div><strong>Sheets: ${metadata.sheets.length}</strong></div>`;
                    file_metadata_div.innerHTML += `<h3>List of Sheets</h3>`;
                    file_metadata_div.innerHTML += `<div>Please select one of the sheets to show the list of columns.</div>`;

                    const hr_list_div = document.createElement("div");
                    hr_list_div.classList.add("hr_list");

                    const ul = document.createElement("ul");
                    ul.style.listStyle = "none";
                    ul.style.padding = "0";

                    metadata.sheets.forEach((sheet: string) => {
                        const li = document.createElement("li");
                        li.textContent = sheet;
                        li.style.display = "inline-block";
                        li.style.padding = "6px 12px";
                        li.style.margin = "4px";
                        li.style.color = "white";
                        li.style.backgroundColor = "#3D91F0";
                        li.style.borderRadius = "6px";
                        li.style.cursor = "pointer";
                        li.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";

                        ul.appendChild(li);
                    });

                    hr_list_div.appendChild(ul);
                    file_metadata_div.appendChild(hr_list_div);
                }

                file_metadata_div.style.display = 'block';
            }

            const data = await getFileData(file);
            file_data = { ...data };
        } catch (error) {
            console.error('Error fetching metadata or data:', error);
        }
    };

    const getFileData = async (file: File) => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        const data: any = {};
        if (ext === 'xlsx') {
            data.type = 'xlsx';
            data.sheets = [];
            data.columns = {};
            data.rows = {};
            data.data = {};

            const fileBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(fileBuffer);
            data.sheets = workbook.SheetNames;

            workbook.SheetNames.forEach(sheetName => {
                const worksheet = workbook.Sheets[sheetName];
                const range = XLSX.utils.decode_range(worksheet['!ref']!);

                const columnNames: string[] = [];
                for (let col = range.s.c; col <= range.e.c; col++) {
                    const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
                    const cellValue = worksheet[cellAddress]?.v || '';
                    columnNames.push(cellValue);
                }
                data.columns[sheetName] = columnNames;
                data.rows[sheetName] = range.e.r - range.s.r;

                const rowDataWithRowNumber: any[] = [];
                for (let row = range.s.r + 1; row <= range.e.r; row++) {
                    const rowObj: any = {};
                    for (let col = range.s.c; col <= range.e.c; col++) {
                        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                        const cellValue = worksheet[cellAddress]?.v || '';
                        const columnName = columnNames[col - range.s.c];
                        rowObj[columnName] = cellValue;
                    }
                    rowDataWithRowNumber.push({ row: row + 1, data: rowObj });
                }

                data.data[sheetName] = rowDataWithRowNumber;
            });

        } else if (ext === 'csv') {
            data.type = 'csv';
            data.columns = [];
            data.rows = 0;
            data.data = [];

            const text = await file.text();

            const parsed = Papa.parse(text, { header: true });
            data.columns = parsed.meta.fields;
            data.rows = parsed.data.length;
            parsed.data.forEach((row: any, index: number) => {
                data.data.push({ row: index + 1, data: row });
            });
        }
        return data;
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.name.endsWith('.csv')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                handleFileUpload(file.name, file);
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid .csv file.');
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.csv')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                handleFileUpload(file.name, file);
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid .csv file.');
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const openUploadDialog = () => {
        const modal = document.getElementById("upload_dialog");
        if (modal) modal.style.display = "block";

        const closeModal = document.getElementById("upload-close");
        closeModal?.addEventListener('click', () => {
            if (modal) modal.style.display = "none";
        });

        window.onclick = (event) => {
            if (event.target === modal && modal) {
                modal.style.display = "none";
            }
        };
    };


    return (
        <div className=" text-black flex flex-col items-center justify-center mt-5 m-auto">
            <div className="grid grid-cols-1 gap-8 max-w-6xl w-full items-center justify-center">
                <div className="flex items-center space-x-3 w-full justify-center">
                    <img src="/demos-page/neuralseek_logo.png" alt="NeuralSeek Logo" className="w-16 h-16" />
                    <h1 className="text-4xl font-bold text-[#6A67CE] dark:text-[#B3B0FF]">RFP Writer</h1>
                </div>
                <div id="upload_section" style={{ display: fileName ? 'none' : 'block' }}>

            
                    <section className="mt-12">
                        <h2 className="text-2xl font-semibold mb-4">How to use this demo</h2>
                        <p>
                            First, upload a document having a tabular structure for the work. Valid file types are *.csv. When a valid document is uploaded, NeuralSeek will help you perform the required RFP work by generating answers.
                        </p>
                    </section>
                    <br />
                    <div
                        className="border-2 border-dashed border-black p-12 rounded-lg cursor-pointer flex items-center justify-center hover:bg-blue-100 dark:bg-blue-900 border border-blue-500 opacity-80 backdrop-blur-sm"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                        onDragEnter={(e) => e.currentTarget.classList.add('bg-blue-100', 'dark:bg-blue-900', 'border', 'border-blue-500', 'opacity-80', 'backdrop-blur-sm', 'pointer-events-none')}
                        onDragLeave={(e) => e.currentTarget.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'border', 'border-blue-500', 'opacity-80', 'backdrop-blur-sm', 'pointer-events-none')}
                    >
                        {fileName ? (
                            <span className="text-lg">Selected File: {fileName}</span>
                        ) : (
                            <span className="text-lg">Drag & drop your CSV file here or click to upload</span>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".csv"
                        />
                    </div>
                </div>
                <div>


                    <div id="file_name" style={{ display: 'none' }}></div>
                    <div id="file_meta">
                    {tableComponent}
                    {tableComponent && (
                        <button
                            className='button'
                            style={{ padding: '8px', width: '100%', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}
                            onClick={downloadTableContent}>
                            Download Content
                        </button>
                    )}
                    </div>
                    <div id="file_data" style={{ display: 'none' }}></div>
                </div>

            </div>

        </div>
    );
};

export default RFPWriterAgent;

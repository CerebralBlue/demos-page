"use client";
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { HomeIcon, MagnifyingGlassIcon, EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

/*
  Test input: Recommendation GDI-08146 for classify
  Main Blue Color: (48, 81, 165)
  Main Yellow Color: (246, 216, 73)
*/

const SpinerDiv = ({ size }: { size: string }) => {
  return (
    <div className={`size-[${size}] animate-spin rounded-full border-2 border-neutral-800/30 border-s-blue-800 border-t-blue-800`}></div>
  )
}

const ImageModal = ({ show, imgData, handleCloseModal }: { show: boolean, imgData: any, handleCloseModal: any }) => {

  return (
    <div className={`top-0 start-0 absolute w-full h-full bg-neutral-800/30 z-[200] ${show ? 'block' : 'hidden'}`}>
      <div className="w-4/5 h-4/5 max-h-[500px] bg-[rgb(48,81,165)] absolute top-[50%] start-[50%] translate-y-[-50%] translate-x-[-50%] rounded-md flex flex-col max-h-[700px]">
        {/* Title Modal */}
        <div className="flex flex-row items-center justify-between p-4">
          <p className="text-white bg-[rgb(48,81,165)] rounded-md">Thumbnail Info</p>
          <XMarkIcon className="w-5 h-5 text-white cursor-pointer" onClick={() => handleCloseModal()} />
        </div>

        {/* Content Modal */}
        <div className="bg-white h-full overflow-y-auto">
          <img className="w-full h-full object-contain" src={`data:${imgData}`} />
        </div>
      </div>
    </div>
  )
}

const PassageModal = ({ show, passageData, handleCloseModal }: { show: boolean, passageData: any, handleCloseModal: any }) => {

  return (
    <div className={`top-0 start-0 absolute w-full h-full bg-neutral-800/30 z-[200] ${show ? 'block' : 'hidden'} `}>
      <div className="w-4/5 bg-[rgb(48,81,165)] absolute top-[50%] start-[50%] translate-y-[-50%] translate-x-[-50%] rounded-md flex flex-col max-h-[700px]">
        {/* Title Modal */}
        <div className="flex flex-row items-center justify-between p-4">
          <p className="text-white bg-[rgb(48,81,165)] rounded-md">Page Info</p>
          <XMarkIcon className="w-5 h-5 text-white cursor-pointer" onClick={() => handleCloseModal()} />
        </div>

        {/* Content Modal */}
        <div className="bg-white h-full p-6 text-sm overflow-y-auto">
          <Markdown rehypePlugins={[rehypeRaw]}>{passageData}</Markdown>
        </div>
      </div>
    </div>
  )
}

const GoodyearDemo = () => {

  const [showEyes, setShowEyes] = useState<any>([]);
  const [showModalImg, setShowModalImg] = useState(false);
  const [showModalPassage, setShowModalPassage] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passages, setPassages] = useState<any>([]);
  const [imgData, setImgData] = useState<any>(null);
  const [passageData, setPassageData] = useState<any>(null);
  const [answer, setAnswer] = useState<any>('');

  const handleMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newMessage = e.target.value;
    if (!message && newMessage === '\n') { setMessage(''); }
    else { setMessage(newMessage); }
  }

  const handleChat = async () => {
    try {
      setIsLoading(true);
      const data = {
        question: message,
        user_session: {
          metdata: { user_id: "" },
        },
        options: {
          language: "en",
          streaming: false,
          proposalID: "",
          includeSourceResults: true,
          sourceResultsNumber: 10,
          sourceResultsSummaryLength: 5000,
          personalize: {
            preferredName: "",
            products: [],
            additionalDetails: ""
          },
          filter: ""
        }
      }

      setMessage('');
      const response: any = await axios.post('/demos-page/api/goodyear-demo', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      
      const answerPassages: any = response.data.passages;
      setAnswer(response.data.answer);
      setPassages(answerPassages);
      setShowEyes(Array(answerPassages.length).fill(false));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickSearch = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!message) { return; };
    handleChat();
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!message) { setMessage(''); return; };
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      handleChat();
    }
  };

  const handleShowEyes = (index: any, shouldShow: boolean) => {
    setShowEyes((prev: any) => {
      let temp = [...prev];
      temp[index] = shouldShow;
      return temp;
    });
  }

  const handleCloseModalImg = () => setShowModalImg(false);
  const handleCloseModalPassage = () => setShowModalPassage(false);

  const handleShowModalImg = (index: any) => {
    const img = passages[index].image64;
    setImgData(img);
    setShowModalImg(true)
  };

  const handleShowModalPassage = (index: any) => {
    const passage = passages[index].passage;
    setPassageData(passage);
    setShowModalPassage(true)
  };

  return (
    <section className="flex flex-col h-full w-full dark:bg-gray-900 dark:text-white">
      {/* Top Banner Menu */}
      <div className="flex flex-row items-center py-4 bg-[rgb(48,81,165)] px-4 justify-between border-b-[8px] border-b-[rgb(246,216,73)]">
        <div className="flex flex-row gap-4 items-center">
          <img className="w-[100px] h-[40px] object-contain" src="/demos-page/files/goodyear-demo/goodyear-logo-header.webp" />
        </div>
      </div>

      {/* Menu Options */}
      <div className="flex flex-row py-4 px-4 gap-4 mb-2 border-b border-b-[rgb(246,216,73)]">
        {/* Home Button */}
        <div className="flex flex-col justify-center text-center cursor-pointer">
          <HomeIcon className="h-7 w-7 mx-auto" />
          <p className="text-xs">Home</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex flex-row px-4 py-2 relative mb-2">
        <textarea
          value={message}
          className="w-full outline-0 shadow-md h-12 pt-3 ps-4 pe-[45px] rounded-xl border"
          placeholder="Search..."
          onChange={handleMessage}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute top-[50%] translate-y-[-50%] right-[30px]">
          {isLoading ? <SpinerDiv size="15px" /> : <MagnifyingGlassIcon className="w-4 h-4 cursor-pointer" onClick={handleClickSearch} />}
        </div>
      </div>

      {/* AI Search Result Message */}
      {answer && !isLoading &&
        <div className="flex flex-row items-center cursor-pointer px-6">
          <p className="mb-4 text-sm">{ answer }</p>
        </div>
      }

      {/* Table */}
      <div className="flex flex-col px-4 gap-2 mb-6">
        {/* Columns */}
        <div className="grid grid-cols-[20%_calc(60%-1rem)_20%] gap-2">
          <div className="p-2 rounded-md bg-[rgb(48,81,165)] text-white text-sm">Document Title</div>
          <div className="p-2 rounded-md bg-[rgb(48,81,165)] text-white text-sm">Page</div>
          <div className="p-2 rounded-md bg-[rgb(48,81,165)] text-white text-sm">Thumbnail</div>
        </div>

        {
          isLoading ?
            <div className="mt-2 flex flex-row items-center justify-center">
              <SpinerDiv size="55px" />
            </div>
            :
            passages.length > 0 ? passages.map((passage: any, i: any) => (
              <div key={`passage${i}`} className="grid grid-cols-[20%_calc(60%-1rem)_20%] gap-2 border-b border-b-neutral-800/10 items-center">
                <div className="p-2 text-sm break-all max-h-[200px] overflow-y-auto">{passage.document}</div>
                <div className="p-2 text-sm break-all max-h-[200px] overflow-y-auto cursor-pointer" onClick={() => handleShowModalPassage(i)}>
                  {passage.passage}
                </div>

                <div className="p-2 text-sm flex flex-row justify-center items-center">
                  <div
                    className="w-[90%] h-[80%] bg-neutral-800/10 relative cursor-pointer"
                    onMouseEnter={() => handleShowEyes(i, true)}
                    onMouseLeave={() => handleShowEyes(i, false)}
                    onClick={() => handleShowModalImg(i)}
                  >
                    <img
                      className="w-full h-full object-contain"
                      src={`data:${passage.image64}`}
                    />
                    <div
                      className={`w-full h-full bg-cyan-300 flex flex-col items-center justify-center bg-neutral-800/20 z-5 absolute top-0 ${showEyes[i] ? 'block' : 'hidden'}`}>
                      <EyeIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))
              :
              <div className="text-sm text-center text-gray-400 py-4">No search results to show</div>
        }
      </div>

      {/* Footer */}
      <div className="flex flex-row items-center p-4 bg-[rgb(48,81,165)] border-b-[8px] border-b-[rgb(246,216,73)] mt-auto">
        <p className="text-white text-xs">
          © May contain confidential and/or propietarty information. May not be copied or disseminated without express written
          consent of The Goodyear Tire & Rubber Company.
        </p>
      </div>

      <ImageModal show={showModalImg} imgData={imgData} handleCloseModal={handleCloseModalImg} />
      <PassageModal show={showModalPassage} passageData={passageData} handleCloseModal={handleCloseModalPassage} />
    </section>
  );
};

export default GoodyearDemo;
import React, { useEffect, useState } from "react";
import { supabase } from "../helper/supabaseClient";
import axios from "axios";
import FileDrawer from "./FileDrawer";
import PDFPreview from "../assets/pdfPreviewDummy.jpg";
import QuickShare from "../components/QuickShare";
import { useDarkMode } from "../context/darkModeContext";
import { Skeleton } from "@mui/material";
import Avatar from "@mui/material/Avatar";

const RecentFiles = () => {
  const { darkMode } = useDarkMode();
  const [files, setFiles] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFileSize, setSelectedFileSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFileId, setSelectedFileId] = useState("");

  const openDrawer = (fileName, fileSize, fileId) => {
    setSelectedFileName(fileName);
    setSelectedFileSize(fileSize);
    setSelectedFileId(fileId);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    async function fetchRecentFiles() {
      try {
        let recentFilesFromBackend = localStorage.getItem("filteredFiles");
        // console.log("Recent files top:", JSON.parse(recentFilesFromBackend));

        const mappedFiles = JSON.parse(recentFilesFromBackend).slice(0, 5);
        console.log("Recent files:", mappedFiles);
        setFiles(mappedFiles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching files:", error);
        setLoading(false);
      }
    }
    fetchRecentFiles();
  }, []);

  useEffect(() => {
    async function recent() {
      const { data, error } = await supabase.storage.from("TwoKey").list();
    }
    recent();
  }, []);

  return (
    <div>
      <div className="flex flex-row justify-between items-center ">
        <p className="text-lg font-semibold my-4">Recent Files</p>
        <span className="flex gap-2">
          <button
            className={`py-1 px-4 rounded-md ${
              darkMode ? "bg-gray-600" : "bg-gray-50"
            } border`}
          >
            + Share
          </button>
          <QuickShare />
        </span>
      </div>
      <div className="grid grid-cols-5 gap-4 bg-inherit text-gray-600">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 p-2 rounded-lg shadow-md"
              >
                <Skeleton variant="rounded" height={110} />
                <span>
                  <h5 className="font-semibold">
                    <Skeleton height={28} width={160} />
                  </h5>
                  <h6 className="text-sm font-semibold">
                    <Skeleton height={22} width={70} />
                  </h6>
                  <p className="text-xs text-gray-500 font-light">
                    <Skeleton height={18} width={60} />
                  </p>
                </span>
              </div>
            ))
          : files.map((file, index) => (
              <div
                key={index}
                className="border border-gray-200 p-2 rounded-lg shadow-md cursor-pointer"
                onClick={() => openDrawer(file.name, file.size, file.id)}
              >
                <img
                  src={PDFPreview}
                  alt="File Preview"
                  className="rounded-md"
                />
                <span>
                  <h5 className="font-semibold">{file.name}</h5>
                  <span className="flex flex-row justify-between items-center">
                    <span>
                      <h6 className="text-sm font-semibold">File Info:</h6>
                      <p className="text-xs text-gray-500 font-light">
                        {file.size}
                      </p>
                    </span>

                    <Avatar
                      src={file.publicUrl}
                      alt="owner pic"
                      sx={{ width: 20, height: 20 }}
                    />
                  </span>
                </span>
              </div>
            ))}
      </div>

      <FileDrawer
        isDrawerOpen={isDrawerOpen}
        closeDrawer={closeDrawer}
        selectedFileName={selectedFileName}
        selectedFileSize={selectedFileSize}
        selectedFileId={selectedFileId}
      />
    </div>
  );
};

export default RecentFiles;

import React, { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { FaRegTrashAlt, FaTimes, FaUpload, FaEye } from "react-icons/fa";
import { toast } from "sonner";

// interface to store the data to be preview like file name, file size, url path and file type
interface DiplayFile {
  fileName: string;
  size: number;
  type: string;
  url: string;
}

function App() {
  const [emailList, setEmailList]: any = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [previewResume, setPreviewResume] = useState<DiplayFile[]>([]);
  const [coverLetter, setCoverLetter] = useState("");
  const [subjectData, setSubjectData] = useState("");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState({
    email: false,
    subject: false,
    coverLetter: false,
    resume: false,
  });
  // Function For Resume File
  // Upload Function
  function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const emptyResume = e.target.files?.length === 0;
    if (emptyResume) {
      setErrors((prev) => ({ ...prev, resume: true }));
    }
    const resumeFiles = e.target.files ? Array.from(e.target.files) : [];

    if (resumeFiles.length > 0) {
      setUploadFiles((prevFiles) => [...prevFiles, ...resumeFiles]);
      const newPreviewDetails = resumeFiles?.map((file) => ({
        fileName: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      }));
      setPreviewResume((prev) => [...prev, ...newPreviewDetails]);
      setErrors((prev) => ({ ...prev, resume: false }));
    }
  }

  // To Display the Selected File
  const [selectedPreviewFile, setSelectedPreviewFile] = useState<DiplayFile[]>(
    []
  );
  // Preview For Upload Files
  function handlePreviewResume(index: number) {
    const selectedFile = previewResume[index];
    setSelectedPreviewFile(selectedFile ? [selectedFile] : []);
  }

  // Delete Function
  function handleResumeDelete(index: number) {
    setUploadFiles((prevFiles) =>
      prevFiles.filter((_, i: number) => i !== index)
    );
    setPreviewResume((prev) => prev.filter((_, i: number) => i !== index));
  }

  // Validate Email Regex
  const validateEmail = (emailList: any) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailList);
  };
  // Email Function to Stored the Array List

  function handleAddEmail() {
    const listOfEmail = emailInput.split(",").map((email) => email.trim());
    const validatedEmailList = listOfEmail.filter((validate) =>
      validateEmail(validate)
    );
    const invalidEmailList = listOfEmail.filter(
      (validate) => !validateEmail(validate)
    );

    if (validatedEmailList.length > 0) {
      setEmailList([...emailList, ...validatedEmailList]);
      setErrors((prev) => ({ ...prev, email: false }));
    }
    if (invalidEmailList.length > 0) {
      toast.error(`Invalid email addresses: ${invalidEmailList.join(", ")}`);
    }
    setEmailInput("");
  }

  // Removing Email
  function handleRemoveEmail(index: number) {
    setEmailList(emailList.filter((_: any, i: number) => i !== index));
  }

  // Cover Letter
  function handleCoverLetter(e: any) {
    setCoverLetter(e.target.value);
    setErrors((prev) => ({ ...prev, coverLetter: false }));
  }
  // Subject Function
  function handleSubject(e: any) {
    setSubjectData(e.target.value);
    setErrors((prev) => ({ ...prev, subject: false }));
  }

  const [isLoading, setIsLoading] = useState(false);
  // Email Submit Function
  async function handleEmailSubmit(e: any) {
    e.preventDefault();
    // Validation Checks
    const newErrors = {
      email: emailList.length === 0,
      subject: subjectData === "",
      coverLetter: coverLetter === "",
      resume: uploadFiles.length === 0,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      toast.error("Please fill all the required fields");
      return;
    }

    setIsLoading(true);
    try {
      //   // MY URL
      const SEND_EMAIL_URL = import.meta.env.VITE_API_URL;

      const formData = new FormData();
      formData.append("to", emailList);
      formData.append("subject", subjectData);
      formData.append("text", coverLetter);
      uploadFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(SEND_EMAIL_URL, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      toast.success(data.message);
    } catch (error) {
      toast.error("Error sending emails");
    } finally {
      setIsLoading(false);
      setEmailList([]);
      setSubjectData("");
      setCoverLetter("");
      setUploadFiles([]);
      setPreviewResume([]);
    }
  }

  return (
    <div className="lg:flex h-screen p-4 ">
      {/* Left Section */}
      <div className="lg:w-3/5 p-4">
        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Emails</label>
          <div className="flex-col space-y-4">
            <Input
              type="text"
              required
              placeholder="Enter email addresses separated by commas"
              className={`w-full ${errors.email ? "border-red-500" : ""}`}
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <Button className="w-full" onClick={handleAddEmail}>
              Add Emails
            </Button>
          </div>
        </div>

        <div className="space-y-2 max-h-[220px] mb-2 overflow-auto">
          {emailList.map((email: string, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-200 rounded-md"
            >
              <span className="text-gray-700">{email}</span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveEmail(index)}
              >
                <FaTimes className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Upload Resume
          </label>
          <div className="flex items-center gap-2 w-full">
            <div className="w-full flex-col ">
              <div className="mb-2 w-1/3">
                <label
                  className={`flex items-center justify-center gap-2 px-4 py-3  mx-auto bg-gray-200 text-gray-700 rounded-md cursor-pointer  hover:bg-gray-300 hover:text-gray-800 ${
                    errors.resume ? "border-red-500 border rpunde" : ""
                  }`}
                >
                  <FaUpload className="w-5 h-5" />
                  <span>Upload</span>
                  <Input
                    required
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleResumeUpload}
                  />
                </label>
              </div>
              <div className="flex-col space-y-3 max-h-[170px] overflow-auto my-1 py-auto">
                {uploadFiles
                  ? uploadFiles.map((file, i: number) => (
                      <div
                        className="flex items-center justify-between p-2 bg-gray-200 rounded-md"
                        key={i}
                      >
                        <span className="text-gray-700">{file.name}</span>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => handlePreviewResume(i)}
                          >
                            <FaEye className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleResumeDelete(i)}
                          >
                            <FaRegTrashAlt className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Subject</label>
            <Input
              placeholder="Write your subject here..."
              required
              value={subjectData}
              className={`w-full ${errors.subject ? "border-red-500" : ""}`}
              onChange={handleSubject}
            />
          </div>
          {/* Cover Letter */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Cover Letter
            </label>
            <Textarea
              required
              value={coverLetter}
              placeholder="Write your cover letter here..."
              className={`w-full h-32 ${
                errors.coverLetter ? "border-red-500" : ""
              }`}
              onChange={handleCoverLetter}
            />
          </div>

          {/* Send Button */}
          <div className="mb-4">
            <Button
              type="submit"
              className="w-full"
              onClick={handleEmailSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Email"}
            </Button>
          </div>
        </div>
      </div>
      {/* Right Section: Preview */}
      <div className="hidden lg:block lg:w-2/5 p-4 bg-gray-100 border-l border-gray-200 ">
        <h2 className="text-lg font-medium mb-4 ">File Preview</h2>
        {/* File Details */}
        {selectedPreviewFile.length > 0
          ? selectedPreviewFile.map((item: any, index: number) => (
              <div className="flex flex-col gap-2" key={index}>
                <div className="flex gap-2 ">
                  <span className="text-md font-medium">File Name : </span>{" "}
                  <span>{item.fileName}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-md font-medium mb-3">File Size : </span>{" "}
                  <span>{(item.size / 1024).toFixed(2)} KB</span>
                </div>
              </div>
            ))
          : null}
        <div>
          {/* File Preview */}
          {selectedPreviewFile.length > 0 ? (
            <div className="w-full">
              {selectedPreviewFile.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 w-full"
                >
                  {item.type.startsWith("image/") ? (
                    <img
                      src={item.url}
                      alt={item.fileName}
                      className="w-full max-h-[400px] object-contain rounded-md border"
                    />
                  ) : item.type === "application/pdf" ? (
                    <embed
                      src={item.url}
                      className="w-full min-h-[580px] border rounded-md"
                      type="application/pdf"
                    />
                  ) : (
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-md border">
                      <span className="text-sm text-gray-700 truncate">
                        {item.FileName}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No files uploaded.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

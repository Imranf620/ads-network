import React, { useState } from "react";
import { uploadFile } from "../../features/domainsSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { toast } from "react-toastify";
import {
  Button,
  TextField,
  Typography,
  Modal,
  Box,
  CircularProgress,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";

interface Component {
  selectedDomain: string;
  setUploadMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const DriveFolderUploadModel: React.FC<Component> = ({
  selectedDomain,
  setUploadMode,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();

  const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const uploadData = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    let pass = undefined ;
    if(password.length>1){
     pass = password;
    }
    setLoading(true);

    try {
      const res = await dispatch(
        uploadFile({ domainId: selectedDomain, file , pass})
      );

      if (res.payload.success) {
        toast.success(res.payload.message);
        setUploadMode(false);
      } else {
        toast.error(res.payload.message);
      }
    } catch (error) {
      toast.error("An error occurred while uploading the file");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUploadMode(false);
  };

  return (
    <Modal
      open
      onClose={handleClose}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: 3,
          borderRadius: 2,
          width: "100%",
          maxWidth: 400,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Upload to Domain: {selectedDomain}
        </Typography>
        <TextField
          type="file"
          onChange={selectFile}
          fullWidth
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />
        <div className=" relative  mb-4">
          <TextField
            type={showPassword ? "text" : "password"}
            label="Password (optional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              width:"100%",
            }}
          />

          <Visibility onClick={()=>setShowPassword(!showPassword)} className="absolute  right-7 top-1/2 -translate-y-1/2" />
        </div>
        {fileName && (
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            Selected File: {fileName}
          </Typography>
        )}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            onClick={uploadData}
            variant="contained"
            sx={{
              backgroundColor: "#4caf50",
              color: "white",
              "&:hover": {
                backgroundColor: "#388e3c",
              },
              width: "48%",
            }}
            disabled={loading || !file}
          >
            {loading ? (
              <>
                Uploading...{" "}
                <CircularProgress size={24} sx={{ marginLeft: 1 }} />
              </>
            ) : (
              "Upload"
            )}
          </Button>
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              backgroundColor: "#f44336",
              color: "white",
              "&:hover": {
                backgroundColor: "#e53935",
              },
              width: "48%",
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DriveFolderUploadModel;

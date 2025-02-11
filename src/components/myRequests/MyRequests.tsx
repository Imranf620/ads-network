import  { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { myRequestsForAd } from "../../features/userSlice";
import {
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Button,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [embedCode, setEmbedCode] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await dispatch(myRequestsForAd());
        if (res.payload.success) {
          setRequests(res.payload.data.allRequestsForAd);
        }
      } catch (error) {
        console.error("Error fetching requests", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [dispatch]);

  // Generate embed codes for different ad types
  const generateEmbedCode = (domain: string, adType: string, CId: string) => {
    const url = `${domain}?CID=${encodeURIComponent(CId)}`;
    const encodedUrl = btoa(url);

    if (adType === "popup") {
      return `<script>
        if (!sessionStorage.getItem('adShown')) {
          const overlay = document.createElement('div');
          overlay.style.position = 'fixed';
          overlay.style.top = '0';
          overlay.style.left = '0';
          overlay.style.width = '100vw';
          overlay.style.height = '100vh';
          overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
          overlay.style.zIndex = '9999';
          overlay.style.cursor = 'pointer';
          overlay.onclick = () => {
            const decodedUrl = atob('${encodedUrl}');
            window.location.href = decodedUrl;
          };
          document.body.appendChild(overlay);
          sessionStorage.setItem('adShown', 'true');
        }
      </script>`;
    }

    if (adType === "button") {
      return `<script>
       
       document.addEventListener("DOMContentLoaded", function () {
        // Load Bootstrap Icons dynamically
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css";
        document.head.appendChild(link);

       const button = document.createElement("button");

        // Set styles for button
        Object.assign(button.style, {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#007BFF",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            textAlign: "center",
            padding: "10px",
            transition: "background 0.3s ease",
            position: "absolute",
            bottom: "20px",
            right: "20px",
            transform: "translate(-50%, -50%)",
        });

        // Create icon element
        const icon = document.createElement("i");
        icon.className = "bi bi-skip-forward"; // Bootstrap Skip Forward icon
        Object.assign(icon.style, {
            fontSize: "24px",
            marginBottom: "5px"
        });

        // Create text element
        const text = document.createElement("span");
        text.innerText = "Skip Ad";

        // Create badge for notification (small number "1")
        const badge = document.createElement("span");
        badge.innerText = "1";
        Object.assign(badge.style, {
            position: "absolute",
            top: "5px",
            right: "5px",
            backgroundColor: "red",
            color: "white",
            fontSize: "10px",
            width: "18px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            fontWeight: "bold",
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)"
        });

        // Append icon, text, and badge to button
        button.appendChild(icon);
        button.appendChild(text);
        button.appendChild(badge);

        // Add hover effect
        button.addEventListener("mouseover", function () {
            button.style.backgroundColor = "#0056b3";
        });

        button.addEventListener("mouseout", function () {
            button.style.backgroundColor = "#007BFF";
        });

        button.onclick = () => {
          const decodedUrl = atob('${encodedUrl}');
          window.open(decodedUrl, '_blank');
        };
        document.body.appendChild(button);
    });

      </script>`;
      
    }

    if (adType === "smartLink") {
      return `<script>
        const link = document.createElement('a');
        link.href = atob('${encodedUrl}');
        link.innerText = 'Click here for an amazing offer!';
        link.style.color = '#007BFF';
        link.style.fontSize = '16px';
        link.style.textDecoration = 'none';
        document.body.appendChild(link);
      </script>`;
    }

    return "";
  };

  const handleCopyEmbedCode = (embedCode: string) => {
    navigator.clipboard
      .writeText(embedCode)
      .then(() => setCopySuccess(true))
      .catch((err) => console.error("Error copying text: ", err));
  };

  const handleDialogOpen = (request: any, adType: string) => {
    const embedCode = generateEmbedCode(
      request.assignedDomain.domain,
      adType,
      request.CId
    );
    setEmbedCode(embedCode);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold text-center mb-6">
        My Ad Requests
      </h2>
      {loading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request: any) => (
            <Card
              key={request._id}
              className="shadow-lg rounded-lg border border-gray-200 p-4 bg-white"
            >
              <CardContent>
                <Typography
                  variant="h6"
                  component="h3"
                  className="font-bold mb-2"
                >
                  Ad Type: {request.adType}
                </Typography>
                <Typography variant="body1" className="text-gray-600 mb-1">
                  <strong>Domain:</strong> {request.domain}
                </Typography>
                <Typography variant="body1" className="text-gray-600 mb-1">
                  <strong>Description:</strong> {request.domainDesc}
                </Typography>
                <Typography variant="body1" className="text-gray-600 mb-1">
                  <strong>Requested At:</strong>{" "}
                  {new Date(request.requestForAdAt).toLocaleString()}
                </Typography>
                <Typography
                  variant="body1"
                  className={`text-sm font-semibold ${
                    request.approved ? "text-green-500" : "text-yellow-500"
                  }`}
                >
                  <strong>Status:</strong>{" "}
                  {request.approved ? "Approved" : "Pending"}
                </Typography>

                {request.approved && request.assignedDomain && (
                  <div className="mt-4 space-x-2">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDialogOpen(request, "popup")}
                    >
                      Popup Ad
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDialogOpen(request, "button")}
                    >
                      Button Ad
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleDialogOpen(request, "smartLink")}
                    >
                      Smart Link Ad
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-lg text-gray-600">
          No requests found.
        </div>
      )}

      {/* Snackbar */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        message="Embed code copied to clipboard!"
      />

      {/* Dialog */}
      <Dialog open={openDialog} fullWidth onClose={handleDialogClose}>
        <DialogTitle>Embed Code</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            value={embedCode}
            InputProps={{
              readOnly: true,
            }}
            rows={6}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleCopyEmbedCode(embedCode)}
          >
            Copy Code
          </Button>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyRequests;

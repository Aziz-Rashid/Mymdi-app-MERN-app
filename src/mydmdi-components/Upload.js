/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  Container,
  Row,
  Col,
  Form,
  Image as BootstrapImage,
  Table,
} from 'react-bootstrap';
import { CButton, CAlert } from '@coreui/react';
import Stepper from 'react-js-stepper';

import Dropzone from 'react-dropzone';
import { DropContainer, UploadMessage } from "./styles";

import QRCode from "react-qr-code";
import { 
  Worker, 
  Viewer, 
  SpecialZoomLevel
} from '@react-pdf-viewer/core';
import { getFilePlugin } from '@react-pdf-viewer/get-file';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

import jsPDF from 'jspdf'

import loadImage from 'blueimp-load-image';
import moment from 'moment';

// Static Variables
const steps = [{title: 'Step 1'}, {title: 'Step 2'}, {title: 'Step 3'},]

function Upload(props) {
  const { isModalOpen, closeModal } = props;
  const [qrCodeString, setQRCodeString] = useState(null);
  const [exifData, setExifData] = useState({});
  const [pdfPassword, setPDFPassword] = useState('');
  const [pdfMetadata, setPDfMetadata] = useState({
    title: '',
    subject: '',
    author: '',
    keywords: '',
    creator: ''
  });
  const [pdfUrl, setPdfUrl] = useState(null);
  const [protectedPDF, setProtectedPDF] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageDimension, setImageDimension] = useState({
    width: 0,
    height: 0,
  });
  // eslint-disable-next-line no-unused-vars
  const [pdfDimension, setPdfDimension] = useState({
    width: 0,
    height: 0,
  });
  const [activeStep, setActiveStep] = useState(1);

  // File Upload Region
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0 ) {
      return;
    }

    let imgType = acceptedFiles[0].type;
    const validImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    if (!validImageTypes.includes(imgType)) {
      alert("Please insert .jpg, .jpeg, and .png files");
      return;
    }
    
    let u = URL.createObjectURL(acceptedFiles[0]); 
    getBase64(acceptedFiles[0]).then(
      data => {
        setImageUrl(data);

        loadImage(
          data,
          function (img, data) {
            var exifIFD = data.exif;
            if (exifIFD) {
              let parsedData = parseExifData(exifIFD.getAll());
              setExifData(parsedData);
            }
          },
          { meta: true }
        );
      }
    );

    let uploadImage = new Image();
    uploadImage.onload = function () {
        setImageDimension({
          height: this.height,
          width: this.width
        });
    };
    uploadImage.src = u;

    // Image uploadded successfully leads to second step automatically
    setTimeout(function(){
      setActiveStep(2);
    }, 1000); 
  };

  const renderDragMessage = (isDragActive, isDragReject) => {
    if (!isDragActive) {
      return <UploadMessage>Drag and drop file here..(.jpg, .jpeg, .png are supported) </UploadMessage>;
    }

    if (isDragReject) {
      return <UploadMessage type="error">Something went wrong..</UploadMessage>;
    }

    return <UploadMessage type="success">File is being uploaded..</UploadMessage>;
  };
  // END: File Upload Region

  // QR Code Region
  const handleChangeQRCode = () => {
    setQRCodeString(JSON.stringify(pdfMetadata));
  };

  const resetMetadata = () => {
    setPDfMetadata({
      title: '',
      subject: '',
      author: '',
      keywords: '',
      creator: ''
    });

    setQRCodeString(JSON.stringify(null));
  }

  const attachQRToPDF = () => {
    const svg = document.getElementById("QRCode");

    let {width, height} = svg.getBBox(); 
    let clonedSvgElement = svg.cloneNode(true);
    let outerHTML = clonedSvgElement.outerHTML;
    let blob = new Blob([outerHTML],{type:'image/svg+xml;charset=utf-8'});
    let blobURL = URL.createObjectURL(blob);

    let image = new Image();
    image.onload = () => {
      let canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      let context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, width, height);
      let jpeg = canvas.toDataURL('image/jpg');

      generatePDF(jpeg);
    };
    image.src = blobURL;
  };
  // END: QR Code Region

  // PDF Helper Region
  const generatePDF = (q = null) => {
    let pdfOrientation = imageDimension.width<imageDimension.height+500? 'p' : 'l';

    let initialPdfWidth = (imageDimension.width*0.75);
    let initialPdfHeight = (imageDimension.height*0.75) + 230;

    var doc = new jsPDF({
      orientation: pdfOrientation, 
      unit: 'pt', 
      format: [initialPdfWidth, initialPdfHeight]
    });

    var pdfWidth = doc.internal.pageSize.getWidth();
    var pdfHeight = doc.internal.pageSize.getHeight();

    setPdfDimension({
      width: pdfWidth,
      height: pdfHeight,
    });

    if (q !== null) {
      doc.addImage(q, 'JPEG', pdfWidth-210, 20);
    }

    doc.addImage(imageUrl, 'JPEG', 0, 230, imageDimension.width*0.75, imageDimension.height*0.75);
    doc.setProperties(pdfMetadata);
    let dataString = doc.output('datauristring');
    setPdfUrl(dataString);
  };

  const getFilePluginInstance = getFilePlugin({
    fileNameGenerator: (file) => {
        const fileName = file.name.substring(file.name.lastIndexOf('/') + 1);
        return `${fileName}`;
    },
  });

  // const { DownloadButton } = getFilePluginInstance;
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;
  // END: PDF Plugins Region

  // Stepper Functions
  const handleOnClickStepper = (step) => setActiveStep(step);
  const handleOnClickNext = () => setActiveStep(activeStep+1);
  const handleOnClickBack = () => setActiveStep(activeStep-1);
  // END: Stepper Functions

  // Other Helper Functions
  const handleChange = (event) => {
    event.preventDefault();

    setPDfMetadata({
      ...pdfMetadata,
      [event.target.name]: event.target.value
    });

    // Change QRCode
    setTimeout(function(){
      handleChangeQRCode();
      attachQRToPDF();
    }, 2000); 
  }

  const handlePasswordChange = (event) => {
    setPDFPassword(event.target.value);
  }

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n) {
      u8arr[n - 1] = bstr.charCodeAt(n - 1)
      n -= 1 // to make eslint happy
    }
    return new File([u8arr], filename, { type: mime })
  }

  function generatePassword() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 12;
    var password = "";
    
    for (var i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber +1);
    }

    setPDFPassword(password);
  }

  const protectPDF = async () => {
    let file = dataURLtoFile(pdfUrl, 'protected.pdf');
    const formData = new FormData();
    formData.append("password", pdfPassword);
    formData.append("file", file, file.name);

    const options = {
      method: 'POST',
      url: 'http://localhost:5000/protectPDF',
      headers: {'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001'},
      data: formData
    };
    
    axios.request(options).then(function (response) {
      console.log(response.data);
      setProtectedPDF(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }

  const formatDate = dateString => {
    var dateAndTime = dateString.split(" ");
    dateAndTime[0] = dateAndTime[0].replaceAll(":", "-");
    return `${dateAndTime[0]} ${dateAndTime[1]}`;
  }

  const parseExifData = imageData => {
    let dateString;
    if (imageData?.Exif?.DateTimeOriginal) {
      dateString = formatDate(imageData?.Exif?.DateTimeOriginal);
    }

    return {
      'Camera Make': imageData?.Make || '',
      'Camera Model': imageData?.Model || '',
      'Focal Length': imageData?.Exif?.FocalLength,
      'Aperture': imageData?.Exif?.ApertureValue,
      'Shuter Speed': imageData?.Exif?.ShutterSpeedValue,
      'Dimensions': (imageData?.Exif?.PixelXDimension && imageData?.Exif?.PixelYDimension)? imageData?.Exif?.PixelXDimension + 'X' + imageData?.Exif?.PixelYDimension : '',
      'Date': dateString? moment(dateString).format("MM-DD-YYYY") : '',
      'Time': dateString? moment(dateString).format("hh:mm:ss a") : '',
    };
  }
  // END: Other Helper Functions

  // React Hooks
  React.useEffect(() => {
    if (activeStep === 2) attachQRToPDF();
  }, [activeStep]);

  React.useEffect(() => {
    if (!isModalOpen) {
      setQRCodeString(null);
      setExifData({});
      setPDfMetadata({
        title: '',
        subject: '',
        author: '',
        keywords: '',
        creator: ''
      });
      setPdfUrl(null);
      setImageUrl(null);
      setImageDimension({
        width: 0,
        height: 0,
      });
      setPdfDimension({
        width: 0,
        height: 0,
      });
      setActiveStep(1);
    }
  }, [isModalOpen]);

  return (
    <Container className="p-4">
      <Stepper 
        steps={steps} 
        activeStep={activeStep}
        onSelect={handleOnClickStepper}
        showNumber={false}
      />
      <Row className="mt-5 justify-content-md-center">
        { activeStep === 1 && (
          <Col md={12}>
            <Form.Group>
              <Dropzone 
                accept="image/*" 
                onDrop={acceptedFiles => onDrop(acceptedFiles)}
                multiple={false}  
              >
                {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
                  <DropContainer
                    {...getRootProps()}
                    isDragActive={isDragActive}
                    isDragReject={isDragReject}
                  >
                    <input {...getInputProps()} accept="image/png, image/gif, image/jpeg" />
                    {renderDragMessage(isDragActive, isDragReject)}
                  </DropContainer>
                )}
              </Dropzone>
            </Form.Group>
          </Col>
        )}

        { activeStep === 2 && (
          <React.Fragment>
            <Col md={6}>
              <BootstrapImage 
                src={imageUrl} 
                thumbnail={true}
                style={{ 
                  height: '260px',
                }} 
              />
            </Col>
            <Col md={6} className={'mt-2'}>
              <div               
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.3)',
                  height: '260px',
                  width: '260px',
                  padding: '5px'
                }}>
                <QRCode id="QRCode" size={250} value={qrCodeString || ''} />
              </div>
            </Col>
            <Col md={6} className={'mt-4'}>
              <Table responsive striped bordered hover>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    { 
                      (Object.keys(exifData).length === 0)? 'No Data Found' : 
                        Object.keys(exifData).map(key =>
                          <tr>
                            <td> {key} </td>
                            <td> {exifData[key]} </td>
                          </tr>
                        )
                    }
                  </tbody>
                </Table>
            </Col>
            <Col md={6} className={'mt-4'}>
              <Form>
                  <Form.Row>
                    <Col>
                      <Form.Group>
                        <Form.Control 
                          placeholder="Title"
                          size="sm"
                          value={pdfMetadata.title || ''}
                          name="title"
                          onChange={handleChange}>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Form.Row>
      
                  <Form.Row>
                    <Col>
                      <Form.Group>
                        <Form.Control 
                          placeholder="Subject"
                          size="sm"
                          value={pdfMetadata.subject || ''}
                          name="subject"
                          onChange={handleChange}>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row>
                    <Col>
                      <Form.Group >
                        <Form.Control 
                          placeholder="Keywords"
                          size="sm"
                          as='textarea'
                          value={pdfMetadata.keywords || ''}
                          name="keywords"
                          onChange={handleChange}>
                        </Form.Control>
                      </Form.Group>
                    </Col> 
                  </Form.Row>
      
                  <Form.Row>
                    <Col>
                      <Form.Group>
                        <Form.Control 
                          size="sm"
                          placeholder="Author"
                          value={pdfMetadata.author || ''}
                          name="author"
                          onChange={handleChange}>
                        </Form.Control>
                      </Form.Group>
                    </Col> 
      
                    <Col>
                      <Form.Group>
                        <Form.Control 
                          size="sm"
                          placeholder="Creator"
                          value={pdfMetadata.creator || ''}
                          name="creator"
                          onChange={handleChange}>
                        </Form.Control>
                      </Form.Group>
                    </Col> 
                  </Form.Row>
              </Form>

              <CButton onClick={resetMetadata} color="danger">Reset</CButton>
            </Col>
          </React.Fragment>
        )}

        { activeStep === 3 && (
          <Col  
            md={12}
            style={{
              height: '650px',
              margin: '0px auto',
              width: '100%'
            }}
          >
            <Row>
              <Col 
                style={{
                  height: '550px',
                }}
                md={12}
              >
                {pdfUrl && (
                  <div
                    style={{
                      border: '1px solid rgba(0, 0, 0, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      width: '100%',
                    }}
                  >
                      <div
                        style={{
                            alignItems: 'center',
                            backgroundColor: '#eeeeee',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            padding: '4px',
                        }}
                      >
                          <Toolbar />
                      </div>
                      <div
                        style={{
                            flex: 1,
                            overflow: 'hidden',
                        }}
                      >
              
                      <Worker
                        workerUrl="https://unpkg.com/pdfjs-dist@2.8.335/build/pdf.worker.min.js"
                        >
                        <Viewer 
                          fileUrl={pdfUrl}
                          plugins={[
                            getFilePluginInstance,
                            toolbarPluginInstance
                          ]}
                          defaultScale={SpecialZoomLevel.PageFit}
                        />
                      </Worker>
                    </div>
                  </div>
                )}
              </Col>
            </Row>
            <Row className="mt-4">
              <Col md={12}>
                <h5>Password Protection</h5>
              </Col>
              <Col md={9}>
                <Form.Group>
                  <Form.Control 
                    placeholder="Password"
                    size="md"
                    value={pdfPassword || ''}
                    name="password"
                    onChange={handlePasswordChange}>
                  </Form.Control>
                  <span style={{ color: "rgb(108 121 134)", cursor: 'pointer', fontSize: '15px' }} onClick={generatePassword}>Generate Password</span>
                </Form.Group>
              </Col>
              <Col md={3}>
                <CButton disabled={pdfPassword.length === 0} onClick={protectPDF} style={{ backgroundColor: "#ddd", width: '160px' }}>Protect PDF</CButton>
              </Col>
            </Row>
          </Col>
        )}
      </Row>

      <div className="mt-5">
        {activeStep ===1 ? '' : <CButton className={'mr-3'} onClick={handleOnClickBack} color="secondary"> Back </CButton> }

        {activeStep !==3 ? '' : <CButton className={'mr-3'} onClick={closeModal} color="danger"> Cancel </CButton> }

        {activeStep ===1 ? 
          <CAlert color="warning">
            Disclaimer— check it out!
          </CAlert> 
          : 
          <CButton onClick={activeStep === steps.length ? null : handleOnClickNext} color="dark">{activeStep === steps.length ? 'Publish' : 'Next'}</CButton> 
        }
      </div>

    </Container>
  );
}

export default Upload;


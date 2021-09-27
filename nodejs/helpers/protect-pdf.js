const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
const stream = require('./stream');
const { Readable } = require('stream');

function bufferToStream(binary) {
    const readableInstanceStream = new Readable({
      read() {
        this.push(binary);
        this.push(null);
      }
    });
    return readableInstanceStream;
}

var protectPDF = function (password = '1234', res, file, fs) {
    try {
        // Initial setup, create credentials instance.
        const credentials = PDFServicesSdk.Credentials
            .serviceAccountCredentialsBuilder()
            .fromFile("pdfservices-api-credentials.json")
            .build();
    
        // Create an ExecutionContext using credentials
        const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);
    
        // Build ProtectPDF options by setting a User Password and Encryption
        // Algorithm (used for encrypting the PDF file).
        const protectPDF = PDFServicesSdk.ProtectPDF,
            options = new protectPDF.options.PasswordProtectOptions.Builder()
                .setUserPassword(password)
                .setEncryptionAlgorithm(PDFServicesSdk.ProtectPDF.options.EncryptionAlgorithm.AES_256)
                .build();
    
        // Create a new operation instance.
        const protectPDFOperation = protectPDF.Operation.createNew(options);
    
        // Set operation input from a source file.
        const readable = bufferToStream(file);

        const input = PDFServicesSdk.FileRef.createFromStream(readable, 'application/pdf');
        protectPDFOperation.setInput(input);
    
        // Execute the operation and Save the result to the specified location.
        protectPDFOperation.execute(executionContext)
            .then(result => {
                let writeStream = new stream.WritableBufferStream();
                result.writeToStream(writeStream);
                writeStream.on('finish', () => {
                    res.writeHead(200, {'Content-Type': 'application/pdf'});
                    res.end(writeStream.toBuffer().toString('base64'), 'binary');
                });
            })
            .catch(err => {
                if(err instanceof PDFServicesSdk.Error.ServiceApiError
                    || err instanceof PDFServicesSdk.Error.ServiceUsageError) {
                    console.log('Exception encountered while executing operation', err);
                } else {
                    console.log('Exception encountered while executing operation', err);
                }
            });
    } catch (err) {
        console.log('Exception encountered while executing operation', err);
    }
}

module.exports = {protectPDF};
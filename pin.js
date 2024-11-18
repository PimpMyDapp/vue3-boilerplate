// https://docs.pinata.cloud/docs/how-do-i-upload-files-to-ipfs
// const {uploadToIPFS} = require("@pinata/sdk/src/commands/pinning/pinFileToIPFS");

const fs = require('fs');
const axios = require('axios');
const path = require('path');
const NodeFormData = require('form-data');

const project = process.env.PROJECT || 'cc-test';
const basePath = __dirname.replace('cc-test', project) + '/dist/';

const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK({ pinataJWTKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwY2VmZTA0ZS1kMzcyLTRkMWEtOTgzZS1mN2RiMGU5YmMzYzUiLCJlbWFpbCI6InBvd2VycG9vbC5vZmZpY2lhbEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMzRhZjViZDA0N2M0OWE1NzgxMjkiLCJzY29wZWRLZXlTZWNyZXQiOiI1MmY2ZjY4N2IzN2Y4Y2FkMTE4MTNhNWRmM2Y3MTQ4NGE5MTAzNDg1OWJhMjE0OWZhMWRiYTY1MThlZTFhMWNkIiwiaWF0IjoxNzA1NTc4NTIxfQ.uQDDvgRgPK_3C7XwfLk37uyRvSMARm5HpP_dsscIros'});

const data = new NodeFormData();
addFilesFromDirToForm(basePath);

uploadToIPFS(pinata, data).then(res => {
  console.log('link is: ',  `https://${res.data.IpfsHash}.ipfs.dweb.link/`);
  console.log('finish');
}).catch(e => {
  console.error('error', e);
});

function uploadToIPFS(pinata, formData, options = {pinataOptions: {cidVersion: 1}}) {
  const endpoint = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  if (options.pinataMetadata) {
    data.append('pinataMetadata', JSON.stringify(options.pinataMetadata));
  }
  if (options.pinataOptions) {
    data.append('pinataOptions', JSON.stringify(options.pinataOptions));
  }
  return axios.post(endpoint, formData,
    createConfigForAxiosHeadersWithFormData(
      pinata.config,
      data.getBoundary()
    )
  )
}

function addFilesFromDirToForm(dirPath) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filepath = path.join(dirPath, file);
    if (fs.lstatSync(filepath).isDirectory()) {
      addFilesFromDirToForm(filepath);
    } else {
      data.append('file', fs.createReadStream(filepath), { filepath: 'dist/' + filepath.replace(basePath, '') });
    }
  });
}

function createConfigForAxiosHeadersWithFormData(config, boundaryValue) {
  const requestOptions = {
    ...createConfigForAxiosHeaders(config),
    maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large files
    maxBodyLength: Infinity
  };
  requestOptions.headers['Content-type'] = `multipart/form-data; boundary=${boundaryValue}`;
  return requestOptions;
}

function createConfigForAxiosHeaders(config) {
  if (
    config.pinataApiKey && config.pinataApiKey.length > 0 &&
    config.pinataSecretApiKey && config.pinataSecretApiKey.length > 0
  ) {
    return {
      withCredentials: true,
      headers: {
        pinata_api_key: config.pinataApiKey,
        pinata_secret_api_key: config.pinataSecretApiKey
      }
    };
  }

  if (config.pinataJWTKey && config.pinataJWTKey.length > 0) {
    return {headers: {Authorization: `Bearer ${config.pinataJWTKey}`}};
  }
  throw new Error('ERROR_NO_CREDENTIALS_PROVIDED');
}

package com.app.pdf_merger.service;

import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class PdfService {

    public byte[] mergeFiles(List<MultipartFile> files) throws IOException {
        PDFMergerUtility mergerUtility = new PDFMergerUtility();

        for(MultipartFile file : files) {
            InputStream inputStream = file.getInputStream();
            mergerUtility.addSource(new RandomAccessReadBuffer(inputStream));
        }

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        mergerUtility.setDestinationStream(byteArrayOutputStream);

        mergerUtility.mergeDocuments(null);

        return byteArrayOutputStream.toByteArray();
    }

}

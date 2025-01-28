package com.app.pdf_merger.controller;

import com.app.pdf_merger.service.PdfService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

@Controller
@AllArgsConstructor
public class AppController {

    private final PdfService pdfService;


    @GetMapping("")
    public String indexPage() {
        return "index";
    }


    @PostMapping(value = "/merge", consumes = MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<byte[]> mergePdf(@RequestParam List<MultipartFile> files) {
        if (files.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        byte[] pdfBytes;
        try {
            pdfBytes = pdfService.mergeFiles(files);
        } catch (IOException e) {
              return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "merged.pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }


}

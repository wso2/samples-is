package org.wso2.photo.view.services;

import org.json.JSONArray;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class PhotoRetrieveService extends HttpServlet {

    private final static List<String> imageArray = new ArrayList<>();

    static {
        imageArray.add("http://localhost.com:8080/photo-edit/res/eagleAlbum.png");
        imageArray.add("http://localhost.com:8080/photo-edit/res/flowerAlbum.png");
    }

    @Override
    protected void doGet(final HttpServletRequest req, final HttpServletResponse resp)
            throws ServletException, IOException {

        // TODO: 12/20/18 Implement logic

        final JSONArray jsonArray = new JSONArray();
        imageArray.forEach(jsonArray::put);

        final ServletOutputStream outputStream = resp.getOutputStream();
        outputStream.print(jsonArray.toString());
        outputStream.close();
    }
}

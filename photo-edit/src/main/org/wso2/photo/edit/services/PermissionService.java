package org.wso2.photo.edit.services;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class PermissionService extends HttpServlet {

    @Override
    protected void doPost(final HttpServletRequest req, final HttpServletResponse resp)
            throws ServletException, IOException {

        final BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(req.getInputStream()));

        final StringBuilder stringBuilder = new StringBuilder();

        String line;

        while ((line = bufferedReader.readLine()) != null) {
            stringBuilder.append(line);
        }

        final JSONObject jsonObject = new JSONObject(stringBuilder.toString());

        // Properties

        final String photoId = jsonObject.getString("photoId");
        final boolean familyView = (boolean) jsonObject.get("familyView");
        final boolean friendView = (boolean) jsonObject.get("friendView");

        System.out.println("Retrieved");

        // TODO: 12/20/18 Implement the rest

    }
}

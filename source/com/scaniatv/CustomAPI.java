/*
 * Copyright (C) 2016-2018 phantombot.tv
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// This class is made to be used in the scripts to call APIs. It will make it way more simple with $.customAPI
package com.scaniatv;

import com.gmt2001.HttpRequest;
import com.gmt2001.HttpResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.MalformedURLException;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.nio.charset.Charset;

import java.util.Iterator;
import java.util.HashMap;
import javax.net.ssl.HttpsURLConnection;

import org.json.JSONObject;
import org.json.JSONException;

public class CustomAPI {
    private static final CustomAPI instance = new CustomAPI();

    /*
     * Method to the this instance.
     *
     * @return {Object}
     */
    public static CustomAPI instance() {
        return instance;
    }

    /*
     * Class constructor.
     */
    private CustomAPI() {
        Thread.setDefaultUncaughtExceptionHandler(com.gmt2001.UncaughtExceptionHandler.instance());
    }

    /*
     * Method to get a JSON Object from an API.
     *
     * @param  {String} url
     * @return {JSONObject}
     */
    public JSONObject getJSON(String url) {
        try {
            HttpResponse data = HttpRequest.getData(HttpRequest.RequestType.GET, url, "", new HashMap<String, String>());
            if (data.success) {
                return new JSONObject(data.content);
            } else {
                throw new JSONException(data.httpCode + ": " + data.exception);
            }
        } catch (JSONException ex) {
            com.gmt2001.Console.err.println("Failed to get JSON data from API: " + ex.getMessage());
        }
        return new JSONObject("{}");
    }

    /*
     * Method to get data from an API.
     *
     * @param  {String} url
     * @return {HttpResponse}
     */
    public HttpResponse get(String url) {
        return HttpRequest.getData(HttpRequest.RequestType.GET, url, "", new HashMap<String, String>());
    }

    /*
     * Method to post to an API.
     *
     * @param  {String} url
     * @param  {String} content
     * @return {HttpResponse}
     */
    public HttpResponse post(String url, String content) {
        return HttpRequest.getData(HttpRequest.RequestType.POST, url, content, new HashMap<String, String>());
    }

    /*
     * Method to put to an API.
     *
     * @param  {String} url
     * @param  {String} content
     * @return {HttpResponse}
     */
    public HttpResponse put(String url, String content) {
        return HttpRequest.getData(HttpRequest.RequestType.PUT, url, content, new HashMap<String, String>());
    }

    /*
     * Method to delete on an API.
     *
     * @param  {String} url
     * @param  {String} content
     * @return {HttpResponse}
     */
    public HttpResponse del(String url, String content) {
        return HttpRequest.getData(HttpRequest.RequestType.DELETE, url, content, new HashMap<String, String>());
    }
    
    /*
     * Reads data from an API. In this case its tipeeestream.
     */
    @SuppressWarnings("UseSpecificCatch")
    public static JSONObject readJsonFromUrl(String urlAddress, String headers) {
        JSONObject jsonResult = new JSONObject("{}");
        InputStream inputStream = null;
        URL urlRaw;
        HttpsURLConnection urlConn;
        String jsonText = "";
        try {
            urlRaw = new URL(urlAddress);
            urlConn = (HttpsURLConnection) urlRaw.openConnection();
            urlConn.setRequestMethod("GET");
            urlConn.addRequestProperty("Content-Type", "application/json; charset=utf-8");

            JSONObject resobj = new JSONObject(headers);
            Iterator<?> keys = resobj.keys();
            while(keys.hasNext() ) {
                String key = (String)keys.next();
                String value = resobj.get(key).toString();
                urlConn.addRequestProperty(key, value);
            }
           
            urlConn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.52 Safari/537.36 PhantomBotJ/2015");
            urlConn.connect();

            if (urlConn.getResponseCode() == 200) {
                inputStream = urlConn.getInputStream();
            } else {
                inputStream = urlConn.getErrorStream();
            }

            BufferedReader rd = new BufferedReader(new InputStreamReader(inputStream, Charset.forName("UTF-8")));
            jsonText = readAll(rd);
            jsonResult = new JSONObject(jsonText);
            fillJSONObject(jsonResult, true, "GET", urlAddress, urlConn.getResponseCode(), "", "", jsonText);
        } catch (JSONException ex) {
            fillJSONObject(jsonResult, false, "GET", urlAddress, 0, "JSONException", ex.getMessage(), jsonText);
            com.gmt2001.Console.debug.println(" TiltifyAPI::readJsonFromUrl::Exception: " + ex.getMessage());
        } catch (NullPointerException ex) {
            fillJSONObject(jsonResult, false, "GET", urlAddress, 0, "NullPointerException", ex.getMessage(), "");
            com.gmt2001.Console.debug.println(" TiltifyAPI::readJsonFromUrl::Exception: " + ex.getMessage());
        } catch (MalformedURLException ex) {
            fillJSONObject(jsonResult, false, "GET", urlAddress, 0, "MalformedURLException", ex.getMessage(), "");
            com.gmt2001.Console.debug.println(" TiltifyAPI::readJsonFromUrl::Exception: " + ex.getMessage());
        } catch (SocketTimeoutException ex) {
            fillJSONObject(jsonResult, false, "GET", urlAddress, 0, "SocketTimeoutException", ex.getMessage(), "");
            com.gmt2001.Console.debug.println(" TiltifyAPI::readJsonFromUrl::Exception: " + ex.getMessage());
        } catch (IOException ex) {
            fillJSONObject(jsonResult, false, "GET", urlAddress, 0, "IOException", ex.getMessage(), "");
            com.gmt2001.Console.debug.println(" TiltifyAPI::readJsonFromUrl::Exception: " + ex.getMessage());
        } catch (Exception ex) {
            fillJSONObject(jsonResult, false, "GET", urlAddress, 0, "Exception", ex.getMessage(), "");
            com.gmt2001.Console.debug.println(" TiltifyAPI::readJsonFromUrl::Exception: " + ex.getMessage());
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException ex) {
                    fillJSONObject(jsonResult, false, "GET", urlAddress, 0, "IOException", ex.getMessage(), "");
                    com.gmt2001.Console.debug.println(" TiltifyAPI::readJsonFromUrl::Exception: " + ex.getMessage());
                }
            }
        }

        return(jsonResult);
    }
    /*
     * Reads data from a stream.
     */
    private static String readAll(Reader rd) throws IOException {
        StringBuilder sb = new StringBuilder();
        int cp;
        while ((cp = rd.read()) != -1) {
            sb.append((char) cp);
        }
        return sb.toString();
    }
    
    /*
     * Populates additional information into a JSON object to be digested
     * as needed.
     */
    private static void fillJSONObject(JSONObject jsonObject, boolean success, String type, String url, int responseCode, String exception, String exceptionMessage, String jsonContent) {
        jsonObject.put("_success", success);
        jsonObject.put("_type", type);
        jsonObject.put("_url", url);
        jsonObject.put("_http", responseCode);
        jsonObject.put("_exception", exception);
        jsonObject.put("_exceptionMessage", exceptionMessage);
        jsonObject.put("_content", jsonContent);
    }
}

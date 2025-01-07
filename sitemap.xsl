<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
    <xsl:output method="html" encoding="UTF-8" indent="yes" />

    <!-- Root template -->
    <xsl:template match="/">
        <html>
            <head>
                <title>XML Sitemap</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.5;
                        margin: 20px;
                        background-color: #f9f9f9;
                        color: #333;
                    }
                    h1 {
                        margin-top: 50px;
                        color: #444;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 50px;
                    }
                    th, td {
                        text-align: left;
                        padding: 10px;
                        border: 1px solid #ddd;
                    }
                    th {
                        padding-top: 16px;
                        background-color: rgb(183, 183, 183);
                        color: #333;
                    }
                    tr:nth-child(odd) {
                        background-color: rgb(235, 235, 235);
                    }
                    tr:nth-child(even) {
                        background-color: white;
                    }
                    tr:hover {
                        background-color: #f1f1f1;
                    }
                    a {
                        color:rgb(12, 93, 93);
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <h1>XML Sitemap</h1>
                <table>
                    <tr>
                        <th>URL</th>
                        <th>Last Modified</th>
                        <th>Change Frequency</th>
                        <th>Priority</th>
                    </tr>
                    <xsl:for-each select="sitemap:urlset/sitemap:url">
                        <xsl:sort select="sitemap:loc" order="ascending" />
                        <tr>
                            <!-- Extract URL -->
                            <td>
                                <a href="{sitemap:loc}" target="_blank">
                                    <xsl:value-of select="sitemap:loc" />
                                </a>
                            </td>
                            <!-- Extract Last Modified -->
                            <td>
                                <xsl:value-of select="sitemap:lastmod" />
                            </td>
                            <!-- Extract Change Frequency -->
                            <td>
                                <xsl:value-of select="sitemap:changefreq" />
                            </td>
                            <!-- Extract Priority -->
                            <td>
                                <xsl:value-of select="sitemap:priority" />
                            </td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>

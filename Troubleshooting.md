# Introduction #

This page describes solutions to common problems running ubiquity under different browsers.


| **Symptom** | **Browsers** | **Solution** |
|:------------|:-------------|:-------------|
| Browser keeps trying to download files with .xhtml extension | IE           | Install [registry key](CrossDomainSubmissionDeployment.md) to make IE support xhtml. |
| Widgets are do not appear | FF3          | Firefox does not support closing tags without content using the `/>` style in .html files.  Ensure that all elements are closed using a `</element>` tag, otherwise the browser may add sibling nodes following the node as children. |
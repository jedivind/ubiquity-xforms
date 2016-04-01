# Introduction #

It should be possible to _size_ controls individually.

# Details #

For example, there is no need for an `<xf:input>` collecting a credit card number and an `<xf:input>` collecting a zip code to be of the same width (the HTML analogy being the `<input size="10">`).

A key aspect of this feature will be to drive the size implicitly (unlike the HTML example) from metadata, e.g. information about display areas required for typical data types.

Similarly, textareas may need to be different sizes, and so on.
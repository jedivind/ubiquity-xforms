# Introduction #

Firefox, when faced with certain elements in a default namespace, modifies the DOM, if those elements appear to be HTML elements that it understands, and believes to be in the wrong place.

# Details #

Even once empty elements have been cleaned up, Firefox is "helpful" with elements it thinks it understands.  In [address test](http://xformstest.org/klotz/examples/address-1/address-ubiquity.html), This manifests itself with the "address" element, which despite the in-scope namespace declaration, is being interpreted as an HTML address element, and, because it doesn't fancy any of its nearby ancestors to be suitable parents of html:address, it is moved out of positon.

This is my "tidied" (see FirefoxEmptyElements) version of the model in [address test](http://xformstest.org/klotz/examples/address-1/address-ubiquity.html), with binds and submissions removed for clarity.
```
<xf:model>
        <xf:instance id="i0">
            <x:subscription xmlns="" xmlns:x="someURN">
                <list>
                    <name>Fuzzy Puppies</name>
                    <email>fuzzy-puppies@example.com</email>
                    <partner>42773</partner>
                    <desc>Fuzzy Puppies picture mailed to you daily!</desc>
                </list>
                <info>
                    <age></age>
                    <email></email>
                    <address>
                        <pobox></pobox>
                        <street></street>
                        <city></city>
                        <state></state>
                        <zip></zip>
                    </address>
                    <name>
                        <first> </first>
                        <last> </last>
                    </name>
                </info>
            </x:subscription>
        </xf:instance>
    <xf:model>
```
This is how firefox sees it:
```
<xf:model>
    <xf:instance id="i0">
        <x:subscription xmlns:x="someURN" xmlns="">
            <list>
                <name>Fuzzy Puppies</name>
                <email>fuzzy-puppies@example.com</email>
                <partner>42773</partner>
                <desc>Fuzzy Puppies picture mailed to you daily!</desc>
            </list>
             <info>
                <age/>
                <email/>
            </info>
        </x:subscription>
    </xf:instance>
</xf:model>
<address>
    <pobox/>
    <street/>
    <city/>
    <state/>
    <zip/>
</address>
<name>
    <first/>
    <last/>
</name>
```

Note that no attention is paid to the existence of closing tags for any ancestor elements.

As with FirefoxEmptyElements This occurs in both quirks mode and standards mode, but not XHTML.
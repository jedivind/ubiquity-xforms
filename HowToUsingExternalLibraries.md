# Introduction #

UXF requires a number of external libraries to work. This page describes the approach we've taken to organising and managing these external libraries.

# Details #

## The _externals_ folder ##

At the top-level of the UXF SVN repository is a folder called _externals_ which contains a folder for each of the libraries that UXF needs.

**Note:** The folder currently only holds Ubiquity Backplane, but we'd like to move all libraries into here.

Within each library folder are a number of other folders containing different versions of the library, and one folder called _current_ which contains the most up-to-date code.

## Adding a new library ##

Adding a library may be as simple as performing an `svn import` command on another repository, or it may require creating a local version from a zip file, and then checking that code in.

In whatever way the source code is placed into the repository, the directory should be called _current_.

After importing an external code drop, the next step is to create a tag with the appropriate version number.

The end result should be a folder for the library, which in turn contains two folders, one for `current` and one for the version number. For example:
```
http://ubiquity-xforms.googlecode.com/svn/externals/ubiquity-backplane/current
http://ubiquity-xforms.googlecode.com/svn/externals/ubiquity-backplane/0.5.2
```

### Adding the library to trunk ###

The library can now be used in the trunk as required. In the case of Ubiquity Backplane this would simply involve copying the current source code to:
```
http://ubiquity-xforms.googlecode.com/svn/trunk/src/lib/backplane
```

Note that we're no longer concerned about differentiating an imported library by placing it into the 'third-party' directory.

## Local modifications ##

If it's necessary to modify the local copy of the library in any way, then this will always be done in the trunk version. Then, when a new version of the library is needed, the differences between the two library versions will be established, and then a merge done using those differences, and any custom modifications that have been applied.

## Upgrading to a new version of the library ##

How to move to a more recent version of a library.
# Introduction #

Ubiquity-xforms distributions are built using the ubiquity [Rollup Generator](http://code.google.com/p/ubiquity/wiki/RollUpGenerator).  The new [build directory](http://ubiquity-xforms.googlecode.com/svn/trunk/build) in ubiquity-xforms contains scripts that call it, and create distributable directories from it.  This document gives instructions on their use.

# Details #
The build process is handled by four batch files:
  * prepare-distribution.bat
> chains the following three files
  * create-dist-directory.bat
> creates a directory on SVN under [dist](http://ubiquity-xforms.googlecode.com/svn/dist), and copies test material to a Working Copy of this directory (build/dist on your local machine).
  * build-ux.bat
> Generates the rollups.
  * copy-distributables.bat
> Copies the rollups and other distributables into the dist directory

Additionally, `lint-ux.bat` is included, and can be used to run JSLint over the project.

## Step 1 ##

When you are ready to make a distribution, run `prepare-distribution.bat`.  This chains together the other three scripts.  You will be asked to enter an identifier for this distribution, this will be used to create a unique folder under dist on the.

## Step 2 ##
When step 1 finishes, you run any desired tests on the output.

## Step 2a ##

If the build fails QA, make any necessary changes and run `build-ux` and/or `copy-distributables`

## Step 3 ##

The folder "build/dist" is now a Working Copy of the directory created by `create-dist-directory`.  Commit this directory and tell the world.


# Note #
Whilst this feature is still under review, distributions created with it are created in [spikes/dist](http://ubiquity-xforms.googlecode.com/svn/spikes/dist)
/*********
 * 
 * Quick program to replace a string in all xhtml files in a directory and any subdirectories.
 * Takes 4 command line arguments in this order:
 *
 * args[0] - directory to begin searching in.
 * args[1] - the needle to replace.
 * args[2] - the replacement string.
 * args[3] - a string to prefix the replacement string with for each subdirectory (Ex. use "../" if making relative URIs).
 * 
 *
 **********/
import java.io.*;

public class RecursiveStringReplacer {
	private static String oldPath;// = "http://ubiquity-xforms.googlecode.com/trunk/ubiquity-loader.js";
	private static String newPath;// = "../../../src/ubiquity-loader.js";
	private static String prefixPerDirectory;// = "../";
	
	public static String readFileContents(File file) {
		String fileContents = "";
		try {
			FileReader fileStream = new FileReader(file);
			int temp;
			try {
				while ((temp = fileStream.read()) != -1) fileContents += (char)temp;
				fileStream.close();
				return fileContents;
			} catch (IOException e) {
			}
		} catch (FileNotFoundException e) {
		}
		return null;
	}
	
	public static void writeFileContents(File file, String contents) {
		System.out.println("Fixed: " + file);
		try {
			FileWriter fileStream = new FileWriter(file);
			fileStream.write(contents);
			fileStream.close();
		} catch (Exception e) {	
		}
	}
	
	private static void findFiles(File currDir, String replacePath) {
		File[] dirContents = currDir.listFiles();
		for (File file : dirContents) {
			if (file.isDirectory()) findFiles(file, prefixPerDirectory + replacePath);
			else {
				if (file.toString().substring(file.toString().lastIndexOf('.')).equals(".xhtml")) {
					String fileContents = readFileContents(file);
					//System.out.println(fileContents);
					String newFileContents = fileContents;
					while (newFileContents.contains(oldPath)) newFileContents = newFileContents.replace(oldPath, replacePath);
					if (!newFileContents.equals(fileContents)) writeFileContents(file, newFileContents);
				}
			}
		}
	}
	
	public static void main(String[] args) {
		oldPath = args[1];
		newPath = args[2];
		prefixPerDirectory = args[3];
		findFiles(new File(args[0]), newPath);
	}

}

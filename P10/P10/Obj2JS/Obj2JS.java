// Garrett Andrews 2017 - V3.0
// Created for CS559 GraphicsTown Project

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

public class Obj2JS {
	public static void main(String[] args) throws IOException {
		List<String[]> vertices = new ArrayList<String[]>();
		List<String[]> normals = new ArrayList<String[]>();
		List<String[]> textCoords = new ArrayList<String[]>();
		String currDir = System.getProperty("user.dir");
		String fileName = "OceanMesh.obj"; // Make sure to change this for each new OBJ file! 
		FileReader reader = new FileReader(currDir + "/src/" + fileName);
		BufferedReader bReader = new BufferedReader(reader);
		String line;
		while ((line = bReader.readLine()) != null) {
			if (!line.contains("#") || !line.contains("f") || !line.contains("s")) {
				String[] data = line.split(" ");
				if (data[0].equals("v")) {
					// this is a vertex component
					// there are 2 ' ' after the 'v' so we need to offset the reference by 1
					String[] content = new String[3];
					content[0] = data[1]; // X
					content[1] = data[2]; // Y
					content[2] = data[3]; // Z
					vertices.add(content);
				}
			}
		}
		reader = new FileReader(currDir + "/src/" + fileName);
		bReader = new BufferedReader(reader);
		while ((line = bReader.readLine()) != null) {
			if (!line.contains("#") || !line.contains("f") || !line.contains("s") || !line.contains("vt")) {
				String[] data = line.split(" ");
				if (data[0].equals("vn")) {
					// this is a normal component
					String[] content = new String[3];
					content[0] = data[1]; // X
					content[1] = data[2]; // Y
					content[2] = data[3]; // Z
					normals.add(content);
				}
			}
		}
		reader = new FileReader(currDir + "/src/" + fileName);
		bReader = new BufferedReader(reader);
		while ((line = bReader.readLine()) != null) {
			if (!line.contains("#") || !line.contains("f") || !line.contains("s") || !line.contains("vn")) {
				String[] data = line.split(" ");
				if (data[0].equals("vt")) {
					// this is a texture coordinate component
					String[] content = new String[2];
					content[0] = data[1]; // X
					content[1] = data[2]; // Y
					textCoords.add(content);
				}
			}
		}
		List<String> finalVertices = new ArrayList<>();
		List<String> finalNormals = new ArrayList<>();
		List<String> finalCoords = new ArrayList<>();
		reader = new FileReader(currDir + "/src/" + fileName);
		bReader = new BufferedReader(reader);
		while ((line = bReader.readLine()) != null) {
			if (!line.contains("#") || !line.contains("s")) {
				String[] data = line.split(" ");
				if (data[0].equals("f")) {
					for (int k = 1; k < data.length; k++) {
						// k=1 to skip 'f'
						String[] face = data[k].split("/");
						finalVertices.add(vertices.get(Integer.valueOf(face[0])-1)[0]);
						finalVertices.add(vertices.get(Integer.valueOf(face[0])-1)[1]);
						finalVertices.add(vertices.get(Integer.valueOf(face[0])-1)[2]);
						
						finalCoords.add(textCoords.get(Integer.valueOf(face[1])-1)[0]);
						finalCoords.add(textCoords.get(Integer.valueOf(face[1])-1)[1]);
						
						finalNormals.add(normals.get(Integer.valueOf(face[2])-1)[0]);
						finalNormals.add(normals.get(Integer.valueOf(face[2])-1)[1]);
						finalNormals.add(normals.get(Integer.valueOf(face[2])-1)[2]);
					}
				}
			}
		}
		System.out.println("Done PART 1");
		ArrayList<String> outputData = new ArrayList<>();
		int count = 0;
		outputData.add("var RENAMEGLOBAL_DATA = {" + '\n');
		outputData.add("object : {" + '\n');
		outputData.add("vertex : { numComponents : 3," + '\n');
		outputData.add("data : [");
		System.out.println("num final vertices: " + finalVertices.size());
		for (int k = 0; k < finalVertices.size(); k++) {
			if (k==finalVertices.size()-1) {
				outputData.add(finalVertices.get(k) + "]}," + '\n');
			}
			else {
				count ++;
				outputData.add(finalVertices.get(k) + ", ");
				if (count == 3) {
					// after adding 3 components
					outputData.add(""+'\n');
					count = 0;
				}
			}
		}
		System.out.println("Done PART 2");
		count = 0;
		outputData.add("normal : { numComponents : 3," + '\n');
		outputData.add("data : [");
		for (int j = 0; j < finalNormals.size(); j++) {
			if (j==finalNormals.size()-1) {
				outputData.add(finalNormals.get(j) + "]}," + '\n');
			}
			else {
				count ++;
				outputData.add(finalNormals.get(j) + ", ");
				if (count == 3) {
					// after adding 3 components
					outputData.add(""+'\n');
					count = 0;
				}
			}
		}
		System.out.println("Done PART 3");
		count = 0;
		outputData.add("texcoord : { numComponents : 2," + '\n');
		outputData.add("data : [");
		for (int l = 0; l < finalCoords.size(); l++) {
			if (l==finalCoords.size()-1) {
				outputData.add(finalCoords.get(l) + "]}," + '\n');
			}
			else {
				count ++;
				outputData.add(finalCoords.get(l) + ", ");
				if (count == 2) {
					// after adding 2 components
					outputData.add(""+'\n');
					count = 0;
				}
			}
		}
		System.out.println("Done PART 4");
		count = 0;
		outputData.add("color : { numComponents : 3," + '\n');
		outputData.add("data : [");
		int m = 0;
		for (;m < finalVertices.size(); m++) {
			if (m==finalVertices.size()-1) {
				outputData.add("1.0" + "]}," + '\n');
			}
			else {
				count ++;
				outputData.add("1.0" + ", ");
				if (count == 3) {
					// after adding 3 components
					outputData.add(""+'\n');
					count = 0;
				}
			}
		}
		outputData.add("}" + '\n' + "};");
		File result = new File(currDir + "/src/" + fileName + "_data.js");
		BufferedWriter out = new BufferedWriter(new FileWriter(result));
		for (String s : outputData) {
			out.write(s);
		}
		bReader.close();
		out.close();
		System.out.println("X1" + vertices.get(Integer.valueOf("1")-1)[0]);
		System.out.println("X2" + vertices.get(3));
		System.out.println("X3" + vertices.get(6));
	}
}
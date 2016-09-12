import string

filename = 'finalresult0.json'
d = list()

files = open('parse.json','w')

with open(filename) as file:
	for line in file:
		line = line.replace("'", "")
		line = line.replace('" ', '"')
		line = line.replace('PROPERT YTYPE', 'PROPERTY TYPE')
		line = line.replace('WALKOUTBASE MENT', 'WALKOUTBASEMENT')
		line = line.replace('ASSESSED VALUE', 'Price')
		line = line.replace('NEIGHBOURHOOD', 'Neighbourhood')

		line = line[0:line.find('"HAS GARAGE"')] + line[line.find('"Price"'):]
		line = line[0:line.find('"BUILDING COUNT"')] + line[line.find('"TOT'):]
		line = line[0:line.find(',"GEOMETRY"')] + line[line.find('}'):]
		line = line[0:line.find('"BUILDINGNAME"')] + line[line.find('"MARKET'):]
		line = line[0:line.find('"HOUSE SUIT"')] + line[line.find('"POSTAL'):]
		print(line)
		
		# print(line[line.find(',"FULLY TAXABLE"')-2:line.find(',"FULLY TAXABLE')])
		if line.find('N/A') == -1 and line[line.find(',"FULLY TAXABLE"') - 2:line.find(',"FULLY')] != '""':
			files.write(line)

files.close()

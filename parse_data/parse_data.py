filename = 'neighbour_numbers.txt'
d = list()

with open(filename) as file:
	for line in file:
		d.append(line.split())

file = open('parse.json','w')

file.write('[')

for elements in d:
	if elements:
		file.write('{"Accountnumber":')
		file.write(str(elements[0]))
		file.write(',"Price":')
		file.write(str(elements[1]))
		file.write(',"Neighbourhood":"')
		file.write(str(elements[2]))
		if elements != d[-3]:
			file.write('"},\n')
		else:
			file.write('"}\n')

file.write(']')



file.close()
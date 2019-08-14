"""
Your task in this exercise has two steps:

- audit the OSMFILE and change the variable 'mapping' to reflect the changes needed to fix 
    the unexpected street types to the appropriate ones in the expected list.
    You have to add mappings only for the actual problems you find in this OSMFILE,
    not a generalized solution, since that may and will depend on the particular area you are auditing.
- write the update_name function, to actually fix the street name.
    The function takes a string with street name as an argument and should return the fixed name
    We have provided a simple test so that you see what exactly is expected
"""
import xml.etree.cElementTree as ET
from collections import defaultdict
import re
import pprint

OSMFILE = "sample.osm"
street_type_re = re.compile(r'\b\S+\.?$', re.IGNORECASE)


expected = ["Street",
            "Avenue",
            "Boulevard",
            "Drive",
            "Court",
            "Place",
            "Square",
            "Lane",
            "Road",
            "Trail",
            "Parkway",
            "Commons",
            "Alley",
            "Soi"]


# UPDATE THIS VARIABLE
mapping = { "St"     : "Street",
            "St."    : "Street",
            "Rd."    : "Road",
            "Rd"     : "Road",
            "road"   : "Road",
            "thanon" : "Thanon",
            "TN"     : "Thanon",
            }


def audit_street_type(street_types, street_name):
    unicode_name = convert_unicode_str(street_name)
    m = street_type_re.search(unicode_name)
    if m:
        street_type = m.group()
        if street_type not in expected:
            street_types[street_type].add(street_name)


def is_street_name(elem):
    return (elem.attrib['k'] == "addr:street")


def audit(osmfile):
    osm_file = open(osmfile, "r")
    street_types = defaultdict(set)
    for event, elem in ET.iterparse(osm_file, events=("start",)):

        if elem.tag == "node" or elem.tag == "way":
            for tag in elem.iter("tag"):
                if is_street_name(tag):
                    audit_street_type(street_types, tag.attrib['v'])

    return street_types

def convert_unicode_str(ustr): 
    '''
    Check is string is unicode or ascii
    '''
    if isinstance(ustr, unicode):
        return ustr.encode('utf-8')

    elif isinstance(ustr, str):
        return ustr

def update_name(name, mapping):
    update_name = convert_unicode_str(name)
    m = street_type_re.search(update_name)
    if m:
        street_type = m.group()
        if street_type in mapping:
            update_name = re.sub(street_type_re, mapping[street_type], update_name)

    return update_name#convert_unicode_str(update_name)

def test():
    st_types = audit(OSMFILE)
    assert len(st_types) == 34
    pprint.pprint(dict(st_types))

    for st_type, ways in st_types.iteritems():
        for name in ways:
            better_name = update_name(name, mapping)
            print convert_unicode_str(name), "=>", better_name
            if name == "Ratchadamri":
                assert better_name == "Thanon Ratchadamri"
            if name == "Bang Na - Trat Rd.":
                assert better_name == "Bang Na - Trat Road"



if __name__ == '__main__':
    test()
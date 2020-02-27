//code sourced here: https://observablehq.com/@d3/bubble-chart
/**
* class for bubble graph
*/
class bubble {
    /**
    * Constructor for data input. The constructor takes data as input, sets the element as the div "bubble-container" - this puts the entire visulization with the div. The draw function is then called, which allows for the visulization to be formed.
    * Data taken from: https://www.ons.gov.uk/peoplepopulationandcommunity/culturalidentity/religion/adhocs/009760religioningreatbritainbyregionoctober2017toseptember2018} Data was in table form, so was put into an array and is taken as input to create the visulization.
    * @param {data} parameter data of religion in UK, by region.
    */
    constructor (data) {
        this.data = data,
        this.element = document.querySelector('.bubble-container');
        this.draw();
    }
/** 
 * creates visulization, haven taken data from constructor. Creates the svg, forms the bubbles, color key and interactivity. The draw function takes no parameter, but is made up of the width, height, svg, color for the bubbles and associated color key, circles are created and interactivity applied to them. The interactivity allows for the bubbles to be highlighted when hovered over, they can be clicked on which brings up information about that piece of data.
 * @param {null} none Takes no parameter
 */
    draw () {
        this.width = 700;
        this.height = this.width;
        this.format = d3.format(',d');

        //creates the svg element, adding it into div element
        this.element.innerHTML = '';
        const svg = d3.select(this.element).append('svg')
        svg.attr('width',  this.width)
        svg.attr('height', this.height)
        // zoom function allows for easier viewing of smaller circles
        //code for zooming sorced here: https://www.d3-graph-gallery.com/graph/interactivity_zoom.html
        svg.call(d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform);
        }))

        //sets color for graph and colour key
        //bubbles in the same group (religion) have the same color, which is shown on the color key
		const color = d3.scaleThreshold()
		  .domain([30, 300, 3000, 30000, 300000, 3000000])
		.range(d3.schemeReds[7]);
        //declares data hierarchy
        const pack = data => d3.pack().size([this.width - 2, this.height - 2]).padding(3)
        (d3.hierarchy({children: data}).sum(d => d.value))
        const root = pack(data);

        //Joins the data to the bubbles and appends this to g elements
        //Transformed to seperate bubbles
        const leaf = svg.selectAll("g")
            .data(root.leaves())
            .join("g")
            .attr("transform", d => `translate(${d.x + 3},${d.y + 3})`);

        //Creates the bubbles through giving their radius and giving them color, with color being determined by data group
        const circle = leaf.append("circle")
            .attr("r", d => d.r )
            .attr("fill", d => color(d.data.value));
        
        //creates colour key for data
        //code for key sourced here: https://observablehq.com/@d3/grouped-bar-chart
        const legend = svg => {
            const g = svg
                .attr("transform", `translate(${this.width},0)`)
                .attr("text-anchor", "end")
                .attr("font-size", 14)
                .selectAll("g")
                .data(color.domain().slice().reverse())
                .join("g")
                .attr("transform", (d, i) => `translate(0,${i * 20})`);
                /**
             * creates key squares
             */
            g.append("rect")
                .attr("x", -19)
                .attr("width", 25)
                .attr("height", 20)
                .attr("fill", color);
            /**
             * creates text for key
             */
            g.append("text")	
                .attr("x", -24)
                .attr("y", 9.5)
                .attr("dy", "0.35em")
                .text(d => d);
        }

        var keys = data.slice(1)
        var groupKey = data[1]

        svg.append("g")
        /**
         * calls color key
         */
            .call(legend);

        //Interactivity for clicking the bubbles, popup of information
       //code for clicking bubbles sourced here: https://observablehq.com/@johnhaldeman/tutorial-on-d3-basics-and-circle-packing-heirarchical-bubb
        let current_circle = undefined;

        function show_information(d) {
            if(current_circle !== undefined){      
                svg.selectAll("#popup").remove();
        }

        current_circle = d3.select(this);
        
        //config of text pop up
        let textblock = svg.selectAll("#popup")
            .data([data])
            .enter()
            .append("g")
            .attr("id", "popup")
            .attr("font-size", 18)
            .attr("text-anchor", "start")
            .attr("transform", d => `translate(0, 30)`)
            .attr("padding", 3);
    
        //appending text of data name and value to text pop up
		textblock.append("text")
			.text("Country: " + (d.data.name))
			.attr("font-weight", "bold")
		textblock.append("text")
		.text("Number of refugees: " + (d.data.value))
			.attr("font-weight", "bold")
			.attr("y", "20");
        }
    
        //edits the circle when clicked on
        //code for mouse click sourced here: http://jonathansoma.com/tutorials/d3/clicking-and-hovering/
        circle.on("click", show_information);
            svg.selectAll('circle').on('mouseover', function(d, i) {
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr("stroke", "black")
                    .attr("stroke-width", "7");
            })
        
            //edits the circle again when unclicked
            .on('mouseout', function(d, i) {
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr("stroke-width", "0");
            })
    }

}


/**
 * data
 * Data is made up of name, and value. The name gives the name of the country, and the value gives the number of reugees to that country.
 */
//data from: https://data.worldbank.org/indicator/SM.POP.REFG.OR?view=chart
data = [
    {name: "Aruba", value: "0"},
    {name: "Afghanistan", value: "2681269"},
    {name: "Angola", value: "8253"},
    {name: "Albania", value: "13518"},
    {name: "Andorra", value: "3"},
    {name: "United Arab Emirates", value: "177"},
    {name: "Argentina", value: "117"},
    {name: "Armenia", value: "11047"},
    {name: "American Samoa", value: "0"},
    {name: "Antigua and Barbuda", value: "107"},
    {name: "Australia", value: "13"},
    {name: "Austria", value: "23"},
    {name: "Azerbaijan", value: "11246"},
    {name: "Burundi", value: "387862"},
    {name: "Belgium", value: "54"},
    {name: "Benin", value: "665"},
    {name: "Burkina Faso", value: "11460"},
    {name: "Bangladesh", value: "21036"},
    {name: "Bulgaria", value: "627"},
    {name: "Bahrain", value: "543"},
    {name: "Bahamas, The", value: "418"},
    {name: "Bosnia and Herzegovina", value: "16964"},
    {name: "Belarus", value: "3539"},
    {name: "Belize", value: "69"},
    {name: "Bermuda", value: "0"},
    {name: "Bolivia", value: "510"},
    {name: "Brazil", value: "1038"},
    {name: "Barbados", value: "214"},
    {name: "Brunei Darussalam", value: "3"},
    {name: "Bhutan", value: "7104"},
    {name: "Botswana", value: "294"},
    {name: "Central African Republic", value: "590874"},
    {name: "Canada", value: "84"},
    {name: "Switzerland", value: "7"},
    {name: "Channel Islands", value: "0"},
    {name: "Chile", value: "482"},
    {name: "China", value: "212050"},
    {name: "Cote d'Ivoire", value: "38323"},
    {name: "Cameroon", value: "45139"},	
    {name: "Congo, Dem. Rep.", value: "720307"},	
    {name: "Congo, Rep.", value: "13352"},	
    {name: "Colombia", value: "138586"},	
    {name: "Comoros", value: "622"},	
    {name: "Cabo Verde", value: "13"},	
    {name: "Costa Rica", value: "211"},	
    {name: "Caribbean small states", value: "6362"},	
    {name: "Cuba", value: "5488"},		
    {name: "Curacao", value: "35"},	
    {name: "Cayman Islands", value: "7"},		
    {name: "Cyprus", value: "10"},	
    {name: "Czech Republic", value: "1240"},	
    {name: "Germany", value: "71"},	
    {name: "Djibouti", value: "2132"},	
    {name: "Dominica", value: "40"},	
    {name: "Denmark", value: "2"},	
    {name: "Dominican Republic", value: "477"},	
    {name: "Algeria", value: "4201"},	
    {name: "Ecuador", value: "1431"},	
    {name: "Egypt, Arab Rep.", value: "24864"},	
    {name: "Eritrea", value: "507267"},	
    {name: "Spain", value: "48"},	
    {name: "Estonia", value: "280"},	
    {name: "Ethiopia", value: "92234"},	
    {name: "Finland", value: "5"},	
    {name: "Fiji", value: "678"},	
    {name: "France", value: "	61"},	
    {name: "Faroe Islands", value: "0"},	
    {name: "Micronesia, Fed. Sts.", value: "0"},	
    {name: "Gabon", value: "347"},	
    {name: "United Kingdom", value: "82"},	
    {name: "Georgia", value: "6975"},	
    {name: "Ghana", value: "18086"},	
    {name: "Gibraltar", value: "1"},	
    {name: "Guinea", value: "23493"},	
    {name: "Gambia, The", value: "17251"},		
    {name: "Guinea-Bissau", value: "2049"},	
    {name: "Equatorial Guinea", value: "144"},	
    {name: "Greece", value: "107"},	
    {name: "Grenada", value: "17251"},	
    {name: "Greenland", value: "0"},	
    {name: "Guatemala", value: "19132"},	
    {name: "Guam", value: "0"},	
    {name: "Guyana", value: "283"},	
    {name: "Hong Kong SAR, China", value: "13"},	
    {name: "Honduras", value: "18860"},	
    {name: "Croatia", value: "24107"},	
    {name: "Haiti", value: "27531"},	
    {name: "Hungary", value: "3927"},		
    {name: "Indonesia", value: "12157"},	
    {name: "Isle of Man", value: "0"},	
    {name: "India", value: "9602"},	
    {name: "Ireland", value: "4"},	
    {name: "Iran, Islamic Rep.", value: "129940"},	
    {name: "Iraq", value: "372342"},	
    {name: "Iceland", value: "4"},	
    {name: "Israel", value: "502"},	
    {name: "Italy", value: "69"},	
    {name: "Jamaica", value: "2453"},	
    {name: "Jordan", value: "2442"},	
    {name: "Japan", value: "48"},	
    {name: "Kazakhstan", value: "2529"},	
    {name: "Kenya", value: "7489"},	
    {name: "Kyrgyz Republic", value: "2942"},	
    {name: "Cambodia", value: "12139"},	
    {name: "Kiribati", value: "1"},	
    {name: "St. Kitts and Nevis", value: "57"},	
    {name: "Korea, Rep.", value: "279"},	
    {name: "Kuwait", value: "1257"},	
    {name: "Lao PDR", value: "6938"},	
    {name: "Lebanon", value: "5639"},	
    {name: "Liberia", value: "5525"},	
    {name: "Libya", value: "13874"},	
    {name: "St. Lucia", value: "1027"},	
    {name: "Liechtenstein", value: "0"},	
    {name: "Sri Lanka", value: "113963"},	
    {name: "Lesotho", value: "11"},	
    {name: "Lithuania", value: "70"},	
    {name: "Luxembourg", value: "3"},	
    {name: "Latvia", value: "156"},	
    {name: "Macao SAR, China", value: "2"},	
    {name: "St. Martin (French part)", value: "0"},	
    {name: "Morocco", value: "3888"},	
    {name: "Monaco", value: "3"},	
    {name: "Moldova", value: "2401"},	
    {name: "Madagascar", value: "298"},	
    {name: "Maldives", value: "73"},	
    {name: "Mexico", value: "12870"},	
    {name: "Marshall Islands", value: "7"},	
    {name: "North Macedonia", value: "1731"},	
    {name: "Mali", value: "158275"},	
    {name: "Malta", value: "4"},	
    {name: "Myanmar", value: "1145154"},	
    {name: "Montenegro", value: "716"},	
    {name: "Mongolia", value: "2254"},	
    {name: "Northern Mariana Islands	", value: "0"},	
    {name: "Mozambique", value: "58"},	
    {name: "Mauritania", value: "37059"},	
    {name: "Mauritius", value: "161"},	
    {name: "Malawi", value: "475"},	
    {name: "Malaysia", value: "823"},	
    {name: "North America", value: "426"},	
    {name: "Namibia", value: "1336"},	
    {name: "New Caledonia", value: "0"},	
    {name: "Niger", value: "2725"},	
    {name: "Nigeria", value: "276853"},	
    {name: "Nicaragua", value: "1673"},	
    {name: "Netherlands", value: "47"},	
    {name: "Norway", value: "9"},	
    {name: "Nepal", value: "8594"},	
    {name: "Nauru", value: "0"},	
    {name: "New Zealand", value: "38"},	
    {name: "Oman", value: "42"},	
    {name: "Pakistan", value: "132259"},	
    {name: "Panama", value: "49"},	
    {name: "Peru", value: "2592"},	
    {name: "Philippines", value: "527"},	
    {name: "Palau", value: "3"},	
    {name: "Papua New Guinea", value: "427"},	
    {name: "Poland", value: "1087"},	
    {name: "Puerto Rico", value: "0"},	
    {name: "Korea, Dem. People’s Rep.", value: "802"},	
    {name: "Portugal", value: "19"},	
    {name: "Paraguay", value: "76"},	
    {name: "West Bank and Gaza", value: "100742"},	
    {name: "Pacific island small states", value: "759"},	
    {name: "French Polynesia", value: "0"},	
    {name: "Qatar", value: "36"},	
    {name: "Romania", value: "1160"},	
    {name: "Russian Federation", value: "61463"},	
    {name: "Rwanda", value: "247481"},	
    {name: "Saudi Arabia", value: "1493"},	
    {name: "Sudan", value: "724791"},	
    {name: "Senegal", value: "18222"},	
    {name: "Singapore", value: "48"},	
    {name: "Solomon Islands", value: "33"},	
    {name: "Sierra Leone", value: "4837"},	
    {name: "El Salvador", value: "32564"},	
    {name: "San Marino", value: "2"},	
    {name: "Somalia", value: "949652"},	
    {name: "Serbia", value: "32370"},	
    {name: "South Sudan", value: "2285316"},	
    {name: "Sub-Saharan Africa", value: "7241992"},	
    {name: "Sao Tome and Principe", value: "30"},	
    {name: "Suriname", value: "20"},	
    {name: "Slovak Republic", value: "1221"},	
    {name: "Slovenia", value: "20"},	
    {name: "Sweden", value: "19"},	
    {name: "Eswatini", value: "240"},	
    {name: "Sint Maarten (Dutch part)", value: "0"},	
    {name: "Seychelles", value: "13"},	
    {name: "Syrian Arab Republic", value: "6654386"},	
    {name: "Turks and Caicos Islands", value: "16"},	
    {name: "Chad", value: "10898"},	
    {name: "Togo", value: "8040"},	
    {name: "Thailand", value: "192"},	
    {name: "Tajikistan", value: "1701"},	
    {name: "Turkmenistan", value: "461"},	
    {name: "Timor-Leste", value: "16"},	
    {name: "Tonga", value: "33"},	
    {name: "Trinidad and Tobago", value: "322"},	
    {name: "Tunisia", value: "1999"},	
    {name: "Turkey", value: "68903"},	
    {name: "Tuvalu", value: "2"},	
    {name: "Tanzania", value: "735"},	
    {name: "Uganda", value: "7035"},	
    {name: "Ukraine", value: "93263"},	
    {name: "Uruguay", value: "19"},	
    {name: "United States", value: "342"},	
    {name: "Uzbekistan", value: "3284"},	
    {name: "St. Vincent and the Grenadines", value: "1255"},	
    {name: "Venezuela, RB", value: "21046"},	
    {name: "British Virgin Islands", value: "0"},	
    {name: "Virgin Islands (U.S.)", value: "0"},	
    {name: "Vietnam", value: "334475"},	
    {name: "Vanuatu", value: "1"},	
    {name: "Samoa", value: "1"},	
    {name: "Kosovo", value: "0"},	
    {name: "Yemen, Rep.", value: "31154"},	
    {name: "South Africa", value: "489"},	
    {name: "Zambia", value: "284"},	
    {name: "Zimbabwe", value: "15629"}
]


const bubbles = new bubble(data);
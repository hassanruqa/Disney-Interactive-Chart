<script>

    d3.csv("data/disney.csv", function(data)
    {
        var filtered_data = data.filter(function(d) { 
            return d.type === "Tv Show" && d.rating.startswith("TV");
        });
    
    console.log(filtered_data);
    
    
    
    
    });


    
    </script>



<?php

	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
	header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept');

	include("connect.php"); 	
	
	$link=Connection();

	$result=mysqli_query($link,"SELECT * FROM data");



	if($result!==FALSE){
		$response = array();
		$response["state"]				=0;
		$response["message"]			="Success.";
		$response["sites"]			=array();
			
		$i=0 ;

		while($row = mysqli_fetch_array($result)) {
		           
	 	   	$response["sites"][$i]["sno"]		=$row["sno"];
			$response["sites"][$i]["sna"]		=$row["sna"];
			$response["sites"][$i]["tot"]		=$row["tot"];
			$response["sites"][$i]["sbi"]		=$row["sbi"];
			$response["sites"][$i]["sarea"]		=$row["sarea"];
			$response["sites"][$i]["mday"]		=$row["mday"];
			$response["sites"][$i]["lat"]		=$row["lat"];
			$response["sites"][$i]["lng"]		=$row["lng"];
			$response["sites"][$i]["ar"]		=$row["ar"];
			$response["sites"][$i]["sareaen"]	=$row["sareaen"];
			$response["sites"][$i]["snaen"]		=$row["snaen"];
			$response["sites"][$i]["aren"]		=$row["aren"];
			$response["sites"][$i]["bemp"]		=$row["bemp"];
			$response["sites"][$i]["act"]		=$row["act"];

			   
			$i++;
			   
		     }
		
		echo json_encode($response);
		//printf( "Success");

		     	
		}
	else{
		$response = array();
		$response["state"]=1;
		$response["message"]="No data found.";
		//echo "Failure";
		echo json_encode($response);
				
	}

	mysqli_free_result($result);
	mysqli_close($link);
?>



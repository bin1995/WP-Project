<?php

	function Connection(){
		$server="";
		$user="";
		$pass="";
		$db="";
	   	
		$connection = mysqli_connect($server, $user, $pass);

		if (!$connection) {
	    	die('MySQL ERROR: ' . mysqli_error($connection));
		}
		
		mysqli_select_db($connection ,$db) or die( 'MySQL ERROR: '. mysqli_error($connection) );

		return $connection;
	}
?>

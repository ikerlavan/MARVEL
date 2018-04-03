<?php
//include 'keys.php';

$url='https://gateway.marvel.com:443/v1/public/characters';
$offset=50;
$limit=100;

$apiKey = 'YOUR API KEY';
$privateKey = 'YOUR PRIVATE KEY';
$fecha = new DateTime();
$ts=$fecha->getTimestamp();
$hash=md5($ts.$privateKey.$apiKey);

$params = array(
		'ts'    => $ts,
		'apikey'=> $apiKey,
		'hash'  => $hash
);

if(isset($_GET["page"]) && isset($_GET["limit"]) && isset($_GET["start"])){
	//echo $_GET["page"];
	$limit 	= $_GET["limit"];
	$offset = $_GET["start"];
	
	$params['offset'] = $offset;
	$params['limit'] = $limit;
}

		
if(isset($_GET["sort"])){
	$arr = json_decode($_GET["sort"]);
	//$obj = json_decode($arr[0]);
	if($arr[0]->property== 'name' || $arr[0]->property == 'modified'){
		$order = $arr[0]->direction == 'DESC' ? '-' : '';
		$params['orderBy'] = $order . $arr[0]->property;
	}
}

if(isset($_GET["filter"])){
	$arr = json_decode($_GET["filter"]);
	//$obj = json_decode($arr[0]);
	foreach($arr as $mydata){
		$params[$mydata->property] = $mydata->value;
	} 
}

if(isset($_GET["url"])){
	$url = $_GET["url"];
}else{
	if(isset($_GET["nameStartWith"])){
		$params['nameStartWith'] = $_GET["nameStartWith"];
	}
	
	if(isset($_GET["name"])){
		$params['name'] = $_GET["name"];
	}
}

$url = $url . '?' . http_build_query($params);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HEADER, 0);
$salida=curl_exec($ch);
echo $salida;
curl_close($ch);

?>
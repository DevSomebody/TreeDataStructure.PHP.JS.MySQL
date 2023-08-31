<?php
header('Content-type: application/json');
require('connection.php');

function dbCheckError($query){
    $error_info = $query->errorInfo();
    if($error_info[0] !== PDO::ERR_NONE){
        echo error_info[2];
        exit();
    }

    return true;
}

function getCategories(){
    global $pdo;

    $sql = "SELECT * FROM categories";

    $query = $pdo->prepare($sql);
    $query->execute();

    dbCheckError($query);

    $categories[] = array();

    while ($row = $query->fetch()) {
        $categories[] = array(
            'id' => $row['id'],
            'parent' => $row['parent_id'],
            'name' => $row['name']
        );
    }

    return $categories;
}

function categoriesTree(){
    $result = getCategories();

    if (count($result) > 0) {
        $index = 1;
        $categories = array();
        while ($index < count($result)){
            $category = array_slice($result, $index, 1);
            $categories_ID[$category[0]['id']][] = $category[0];
            $categories[$category[0]['parent']][$category[0]['id']] = $category[0];
            $index++;
        }
        
        return $categories;
    }
    return null;
}

echo json_encode(categoriesTree());

<?php
/**
 * Script Name: Pager.php
 * Author: John C. Scott
 * Copyright 2005 Scott Communications
 * Created: 4/17/05
 * Modified: 2/15/08
 *
 * Description:
 * 	PHP 5 class for building multiple page links. Assumes mySQL database.
 *
 * TODO:
 * 	Probably should consolidate this more. Make use of __destruct?
 */

class Pager
{
	private $_dbObject; // the database connection object established in config.php
	private $_query;
	private $_offset; // first row to select
	private $_limit; // number of rows to select
	private $_numPages;
	private $_page;
	public static $total = 0; // total number of results found

	public function __construct($query, $limit, $page, $dbObject) {
		$this->_query = $query;
		$this->_dbObject = $dbObject;

		// Create "SELECT COUNT(*)" query from submitted $query.
		$pattern = "@(SELECT).+(FROM)@i";
		$replacement = "$1 COUNT(*) $2";
		$countQuery = preg_replace($pattern, $replacement, $this->_query);

		$result = mysql_query($countQuery, $this->_dbObject);
		if (!$result) {
			die('Invalid query: ' . mysql_error() . " query: " . $this->_query);
		}

		// Save this count to be recalled later, if you want it.
		self::$total = mysql_result($result, 0);

		// work out the pager values
		list($this->_offset, $this->_limit, $this->_numPages, $this->_page) = $this->_getPagerData(self::$total, $limit, $page);
	}

	private function _getPagerData($numHits, $limit, $page) {
		// Make sure we've got integers!
		$numHits = (int) $numHits;
		$limit = max((int) $limit, 1);
		$page = (int) $page;
		$numPages = ceil($numHits / $limit);

		$page = max($page, 1);
		$page = min($page, $numPages);

		$offset = ($page - 1) * $limit;
		// Avoids bizarre negative float if sql query has no results.
		// And no, the abs() function doesn't do the same thing. Think about it.
		if($offset < 0) { $offset = 0; }

		return array($offset, $limit, $numPages, $page);
	}

  public static function doQuery() {
		$result = mysql_query($this->_query . " LIMIT " .$this->_limit . " OFFSET " . $this->_offset, $this->_dbObject);
		if (!$result) {
			die('Invalid query: ' . mysql_error() . " query: " . $this->_query);
		}

		return $result;
	}

	function static doPaging($thepage, $linkItems) {
		$output = '';

		// Items listed here are search parameters allowed in the this url.
		$finalLink = $_SERVER['PHP_SELF'].'?';

		// Collect any existing $_REQUEST variables matched from the passed
		// $linkItems array into a new link segment. Use rawurlencode() too here.
		foreach ( $_REQUEST as $key=>$value )
		{
			if(in_array ( $key, $linkItems, true )) {
				$finalLink .= $key.'='.rawurlencode(stripslashes($value)).'&amp;';
			}
		}

		if ($this->_numPages > 1)
		{
			$output = "\t\t<table id=\"pagingTable\" summary=\"Multi-page Results Links\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n\t\t\t<tr>\n\t\t\t\t";

			// Previous
			if ($this->_page == 1) // this is the first page - there is no previous page
			{
				$output .= "<td id=\"prev\">&nbsp;</td>\n\t\t\t\t";
			}
			else // not the first page, link to the previous page
			{
				$output .= "<td id=\"prev\"><a href=\"".$finalLink.$thepage."=".($this->_page - 1)."\">previous</a></td>\n\t\t\t\t";
			}

			// Generate page by page links
			$output .= "<td id=\"pageLinks\">\n\t\t\t\t";

			for ($i = 1; $i <= $this->_numPages; $i++) {
				if ($i > 1) { $output .= " | "; }
				if ($i == $this->_page)
				{
					$output .= "<span id=\"currPage\">".$i."</span>";
				}
				else
				{
					$output .= "<a href=\"".$finalLink.$thepage."=".$i."\">".$i."</a>";
				}
			}

			$output .= "</td>\n\t\t\t";

			// Next
			if ($this->_page == $this->_numPages) // this is the last page
			{
				$output .= "<td id=\"next\">&nbsp;</td>\n\t\t\t";
			}
			else // not the last page, link to the next page
			{
				$output .= "<td id=\"next\"><a href=\"".$finalLink.$thepage."=".($this->_page + 1)."\">next</a></td>\n\t\t\t";
			}

			$output .= "</tr>\n\t\t</table>\n\t";
		}

		return $output;
	}
}
?>
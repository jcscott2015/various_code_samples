<?php
/**
 * Session.php
 * Class that sets the session to a mySQL database.
 * @usage
 * Call to register user call back functions.
 * ini_set('session.save_handler', 'user'); // set this to call custom handler
 * ini_set('session.save_path', MYSQL_DB); // name of database
 * ini_set('session.name', 'PHPSESSION'); // name of table
 * ini_set('session.gc_maxlifetime', '21600'); // set max lifetime to 6 hours
 * 
 * // Instantiate
 * $session = new Session();
 * 
 * // Initialize variables
 * $session->_sess_host = MYSQL_HOST;
 * $session->_sess_user = MYSQL_USER;
 * $session->_sess_pass = MYSQL_PASS;
 * $session->_field_id = "session_id";
 * $session->_field_data = "session_variable";
 * $session->_field_time = "last_accessed";
 *
 * // Set session handler
 * session_set_save_handler(array($session, 'sess_open'),
 * 						 array($session, 'sess_close'),
 * 						 array($session, 'sess_read'),
 * 						 array($session, 'sess_write'),
 * 						 array($session, 'sess_destroy'),
 * 						 array($session, 'sess_gc'));
 * 
 * // Start session
 * @session_start();
 *
 * @author John C. Scott <jcscott@scottcomm.com>
 * @modified 3/30/08
 */

class Session
{
	/**
	 * a database connection strings
	 * @var strings
	 */
	public $_existing_db; // holds any existing connection resource.
	public $_sess_host;
	public $_sess_user;
	public $_sess_pass;
	public $_sess_db_name;
	public $_sess_table;
	public $_field_id;
	public $_field_data;
	public $_field_time;

	/**
	 * a database connection resource
	 * @var resource
	 */
	private $_sess_db;

	/**
	 * Open the session.
	 * @return bool
	 */
	public function sess_open($db_name, $table_name)
	{
		$this->_sess_db_name = $db_name;
		$this->_sess_table = $table_name;
		
		if (empty($this->_existing_db)) {
			$this->_sess_db = mysql_connect($this->_sess_host, $this->_sess_user, $this->_sess_pass);
			if (!$this->_sess_db) { die("sess_open() - Could not connect: " . mysql_errno() . ": " . mysql_error()); }
		} else {
			$this->_sess_db = $this->_existing_db;
		}
	
		if(!mysql_select_db($this->_sess_db_name, $this->_sess_db)) {
			die("sess_open(): " . mysql_errno() . ": " . mysql_error());
		} else {
			return true;
		}

		return false;
	}
	
	/**
	 * This function is called whenever a @session_start()
	 * call is made and reads the session variables
	 * Returns "" when a session is not found (serialized) string - session exists
	 * @param int session id
	 * @return string of the session
	 */
	public function sess_read($id)
	{
		$sql = "SELECT * FROM " . $this->_sess_table . " WHERE " . $this->_field_id . " = '" . $id . "'";
		 
		// Execute the query
		$result = mysql_query($sql, $this->_sess_db);
		// Send error message on query failure
		if (!$result) { die("sess_read(): " . mysql_errno() . ": " . mysql_error() . ": " . $sql); }
	
		if (mysql_num_rows($result)) {
			$record = mysql_fetch_array($result);
			return $record[$this->_field_data];
		}
		
		return "";
	}
	
	/**
	 * This function is called when a session is initialized
	 * with a @session_start() call, when variables are
	 * registered or unregistered, and when session variables
	 * are modified. Returns true on success.
	 * @param int session id
	 * @param string data of the session
	 */
	public function sess_write($id, $data)
	{
		//$sql = "REPLACE INTO " . $this->_sess_table . " (" . $this->_field_id . ", " . $this->_field_data . ") VALUES ('$id', '$data')";
		//$sql = "UPDATE " . $this->_sess_table . " SET " . $this->_field_data . " = '$data' WHERE " . $this->_field_id . " = '$id'";
		$sql = "INSERT INTO " . $this->_sess_table . " SET " . $this->_field_id . " = '$id', " . $this->_field_data . " = '$data' ON DUPLICATE KEY UPDATE " . $this->_field_data . " = '$data'";

		// Execute the query
		$result = mysql_query($sql, $this->_sess_db);
		// Send error message on query failure
		if (!$result) { die("sess_write(): " . mysql_errno() . ": " . mysql_error() . ": " . $sql); }

		return true;
	}
	
	/**
	 * Close the session.
	 * @return bool
	 */
	public function sess_close()
	{
		if (!mysql_close($this->_sess_db))
		{
			die("sess_close(): " . mysql_errno() . ": " . mysql_error());
		} else {
			return true;
		}
	}
	
	/**
	 * Destroy the session.
	 * @param int session id
	 * @return bool
	 */
	public function sess_destroy($id)
	{
		$delete_query = 
			"DELETE FROM " . $this->_sess_table . " WHERE " . $this->_field_id . " = '" . $id . "'";
		if ($this->_kill_sess($delete_query)) { return true; }
		
		return false;
	}
	
	/** 
	 * Garbage Collector
	 * This function is called on a session's start up with
	 * the probability specified in session.gc_probability.
	 * Performs garbage collection by removing all sessions
	 * that haven't been updated in the last $max_lifetime
	 * seconds as set in session.gc_maxlifetime.
	 * Returns true if the DELETE query succeeded.
	 * @param int life time (sec.)
	 * @return bool
	 * @see session.gc_divisor      100
	 * @see session.gc_maxlifetime 1440
	 * @see session.gc_probability    1
	 * @usage execution rate 1/100
	 *        (session.gc_probability/session.gc_divisor)
	 */
	public function sess_gc($max_lifetime)
	{
		$delete_query =
			"DELETE FROM " . $this->_sess_table . 
				" WHERE UNIX_TIMESTAMP(" . $this->_field_time . ") < UNIX_TIMESTAMP() - " . $max_lifetime;
	
		if ($this->_kill_sess($delete_query)) { return true; }
		
		return false;
	}

	/** 
	 * Session Trasher
	 * This function thoroughly kills a session.
	 * Returns true if the DELETE query succeeded and deleted something.
	 * @param string delete query
	 * @return bool
	 */
	private function _kill_sess($delete_query)
	{
		// Execute the query
		$result = mysql_query($delete_query, $this->_sess_db);
		// Send error message on query failure
		if (!$result) { die("sess_delete(): " . mysql_errno() . ": " . mysql_error() . ": " . $delete_query); }

		if (mysql_affected_rows($this->_sess_db) > 0) {
			$optimize_query = "OPTIMIZE TABLE " . $this->_sess_table;

			// Execute the query
			$result = mysql_query($optimize_query, $this->_sess_db);
			// Send error message on query failure
			if (!$result) { die("sess_delete() - optimize_table: " . mysql_errno() . ": " . mysql_error() . ": " . $optimize_query); }

			// Unset all of the session variables.
			$_SESSION = array();
			
			// If it's desired to kill the session, also delete the session cookie.
			// Note: This will destroy the session, and not just the session data!
			if (isset($_COOKIE[session_name()])) {
				setcookie(session_name(), '', time()-42000, '/');
			}
			
			return true;
		}
		
		return false;
	}
}
?>
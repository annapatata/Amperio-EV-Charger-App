
DELIMITER $$

CREATE TRIGGER log_charger_status_change
AFTER UPDATE ON Charger
FOR EACH ROW
BEGIN
    -- Only log if the status actually changed
    IF OLD.charger_status <> NEW.charger_status THEN
        INSERT INTO ChargerStatusHistory (charger_id, time_ref, old_state, new_state)
        VALUES (NEW.charger_id, NOW(), OLD.charger_status, NEW.charger_status);
    END IF;
END$$

DELIMITER ;

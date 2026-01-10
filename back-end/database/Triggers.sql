
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

DELIMITER //

CREATE TRIGGER before_session_insert
BEFORE INSERT ON Session
FOR EACH ROW
BEGIN
    DECLARE calculated_total_cost DECIMAL(8,3) DEFAULT 0;
    DECLARE total_session_sec INT;

    -- 1. Calculate the total session duration in seconds
    SET total_session_sec = TIMESTAMPDIFF(SECOND, NEW.start_time, NEW.end_time);

    -- 2. Only calculate if there is duration and energy, otherwise cost is 0
    IF total_session_sec > 0 AND NEW.energy_delivered > 0 THEN
        SELECT SUM(
            -- Energy ratio: (Time in this window / Total session time)
            -- Multiplied by total energy and the price for this window
            NEW.energy_delivered * (TIMESTAMPDIFF(SECOND, 
                GREATEST(NEW.start_time, eph.time_ref), 
                LEAST(NEW.end_time, COALESCE(
                    (SELECT MIN(time_ref) FROM EnergyPricingHistory WHERE time_ref > eph.time_ref), 
                    NOW()
                ))
            ) / total_session_sec) * eph.current_price
        ) INTO calculated_total_cost
        FROM EnergyPricingHistory eph
        WHERE eph.time_ref < NEW.end_time 
          AND (SELECT MIN(time_ref) FROM EnergyPricingHistory WHERE time_ref > eph.time_ref) > NEW.start_time;
    END IF;

    -- 3. Store the result in the new column
    SET NEW.wholesale_cost = IFNULL(calculated_total_cost, 0);
END //

DELIMITER ;
